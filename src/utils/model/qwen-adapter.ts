/**
 * Qwen API Adapter
 *
 * Converts between Anthropic API format and OpenAI-compatible format used by Qwen
 */

import type { ClientOptions } from '@anthropic-ai/sdk'

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; source?: any }>
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AnthropicRequest {
  model: string
  messages: AnthropicMessage[]
  max_tokens: number
  temperature?: number
  top_p?: number
  stream?: boolean
  system?: string
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  stream?: boolean
}

/**
 * Convert Anthropic message format to OpenAI format
 */
function convertAnthropicToOpenAI(anthropicReq: AnthropicRequest): OpenAIRequest {
  const messages: OpenAIMessage[] = []

  // Add system message if present
  if (anthropicReq.system) {
    messages.push({
      role: 'system',
      content: anthropicReq.system
    })
  }

  // Convert messages
  for (const msg of anthropicReq.messages) {
    let content: string

    if (typeof msg.content === 'string') {
      content = msg.content
    } else if (Array.isArray(msg.content)) {
      // Extract text from content blocks
      content = msg.content
        .filter(block => block.type === 'text' && block.text)
        .map(block => block.text)
        .join('\n')
    } else {
      content = ''
    }

    messages.push({
      role: msg.role,
      content
    })
  }

  return {
    model: anthropicReq.model,
    messages,
    max_tokens: anthropicReq.max_tokens,
    temperature: anthropicReq.temperature,
    top_p: anthropicReq.top_p,
    stream: anthropicReq.stream
  }
}

/**
 * Create a fetch wrapper that adapts Anthropic API calls to OpenAI format
 */
export function createQwenFetchAdapter(
  baseURL: string,
  apiKey: string,
  innerFetch?: ClientOptions['fetch']
): ClientOptions['fetch'] {
  const actualFetch = innerFetch ?? globalThis.fetch

  return async (input, init) => {
    const url = input instanceof Request ? input.url : String(input)

    // Only intercept /v1/messages endpoint
    if (!url.includes('/v1/messages')) {
      return actualFetch(input, init)
    }

    try {
      // Parse the Anthropic request
      const anthropicReq = JSON.parse(init?.body as string) as AnthropicRequest

      // Convert to OpenAI format
      const openaiReq = convertAnthropicToOpenAI(anthropicReq)

      // Call Qwen API
      const qwenUrl = `${baseURL}/chat/completions`
      const qwenResponse = await actualFetch(qwenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(openaiReq)
      })

      if (!qwenResponse.ok) {
        const errorText = await qwenResponse.text()
        throw new Error(`Qwen API error: ${qwenResponse.status} ${errorText}`)
      }

      // Handle streaming response
      if (openaiReq.stream) {
        return convertOpenAIStreamToAnthropic(qwenResponse)
      }

      // Handle non-streaming response
      const openaiResp = await qwenResponse.json()
      const anthropicResp = convertOpenAIToAnthropic(openaiResp)

      // Create a Response object
      return new Response(JSON.stringify(anthropicResp), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Qwen adapter error:', error)
      throw error
    }
  }
}

/**
 * Convert OpenAI response to Anthropic format
 */
function convertOpenAIToAnthropic(openaiResp: any): any {
  const choice = openaiResp.choices?.[0]
  if (!choice) {
    throw new Error('No choices in OpenAI response')
  }

  return {
    id: openaiResp.id || 'msg_' + Date.now(),
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: choice.message?.content || ''
      }
    ],
    model: openaiResp.model,
    stop_reason: choice.finish_reason === 'stop' ? 'end_turn' : choice.finish_reason,
    usage: {
      input_tokens: openaiResp.usage?.prompt_tokens || 0,
      output_tokens: openaiResp.usage?.completion_tokens || 0
    }
  }
}

/**
 * Convert OpenAI streaming response to Anthropic format
 */
function convertOpenAIStreamToAnthropic(response: Response): Response {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) continue

            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const openaiChunk = JSON.parse(data)
              const anthropicChunk = convertOpenAIChunkToAnthropic(openaiChunk)
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(anthropicChunk)}\n\n`))
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream'
    }
  })
}

/**
 * Convert OpenAI streaming chunk to Anthropic format
 */
function convertOpenAIChunkToAnthropic(openaiChunk: any): any {
  const delta = openaiChunk.choices?.[0]?.delta

  if (delta?.content) {
    return {
      type: 'content_block_delta',
      index: 0,
      delta: {
        type: 'text_delta',
        text: delta.content
      }
    }
  }

  if (openaiChunk.choices?.[0]?.finish_reason) {
    return {
      type: 'message_delta',
      delta: {
        stop_reason: openaiChunk.choices[0].finish_reason === 'stop' ? 'end_turn' : openaiChunk.choices[0].finish_reason
      }
    }
  }

  return {
    type: 'message_start',
    message: {
      id: openaiChunk.id || 'msg_' + Date.now(),
      type: 'message',
      role: 'assistant',
      content: [],
      model: openaiChunk.model
    }
  }
}
