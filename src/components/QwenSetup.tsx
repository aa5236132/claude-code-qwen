import { Box, Text } from '../../ink.js'
import TextInput from '../TextInput.js'
import { useState } from 'react'
import { saveGlobalConfig, getGlobalConfig } from '../../utils/config.js'
import { logEvent } from '../../services/analytics/index.js'

type Props = {
  onDone: () => void
}

export function QwenSetup({ onDone }: Props) {
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('https://dashscope.aliyuncs.com/compatible-mode/v1')
  const [step, setStep] = useState<'api-key' | 'base-url' | 'confirm'>('api-key')

  const handleApiKeySubmit = (value: string) => {
    if (value.trim()) {
      setApiKey(value.trim())
      setStep('base-url')
    }
  }

  const handleBaseUrlSubmit = (value: string) => {
    if (value.trim()) {
      setBaseUrl(value.trim())
    }
    setStep('confirm')
  }

  const handleConfirm = () => {
    // Save to environment or config
    const config = getGlobalConfig()
    saveGlobalConfig({
      ...config,
      qwenApiKey: apiKey,
      qwenBaseUrl: baseUrl,
    })

    logEvent('tengu_qwen_configured', {})
    onDone()
  }

  if (step === 'api-key') {
    return (
      <Box flexDirection="column" gap={1} paddingLeft={1}>
        <Text bold>Configure Qwen API</Text>
        <Text>
          Enter your Qwen API Key from DashScope:
        </Text>
        <Text dimColor>
          Get your API key at: https://dashscope.console.aliyun.com/
        </Text>
        <Box marginTop={1}>
          <TextInput
            value={apiKey}
            onChange={setApiKey}
            onSubmit={handleApiKeySubmit}
            placeholder="sk-..."
            mask="*"
          />
        </Box>
      </Box>
    )
  }

  if (step === 'base-url') {
    return (
      <Box flexDirection="column" gap={1} paddingLeft={1}>
        <Text bold>Qwen API Base URL</Text>
        <Text>
          Enter the API base URL (press Enter to use default):
        </Text>
        <Text dimColor>
          Default: https://dashscope.aliyuncs.com/compatible-mode/v1
        </Text>
        <Box marginTop={1}>
          <TextInput
            value={baseUrl}
            onChange={setBaseUrl}
            onSubmit={handleBaseUrlSubmit}
            placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1"
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Text bold>Qwen Configuration Summary</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text>API Key: {apiKey.substring(0, 10)}...</Text>
        <Text>Base URL: {baseUrl}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          To use Qwen, set CLAUDE_CODE_USE_QWEN=true and restart.
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          Press <Text bold>Enter</Text> to save and continue.
        </Text>
      </Box>
    </Box>
  )
}
