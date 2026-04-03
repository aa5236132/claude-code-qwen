/**
 * Qwen API integration for Claude Code
 *
 * Environment variables:
 * - QWEN_API_KEY or DASHSCOPE_API_KEY: Required for Qwen API access
 * - QWEN_BASE_URL: Optional. Base URL for Qwen API (default: https://dashscope.aliyuncs.com/compatible-mode/v1)
 */

export const QWEN_DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
export const QWEN_DEFAULT_MODEL = 'qwen-plus'

export function getQwenApiKey(): string | undefined {
  // Support both QWEN_API_KEY and DASHSCOPE_API_KEY
  return process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY
}

export function getQwenBaseUrl(): string {
  return process.env.QWEN_BASE_URL || QWEN_DEFAULT_BASE_URL
}

/**
 * Check if Qwen API is configured
 */
export function isQwenConfigured(): boolean {
  return !!getQwenApiKey()
}
