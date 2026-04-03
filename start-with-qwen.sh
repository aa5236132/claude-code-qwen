#!/bin/bash

# Qwen 3.6-Plus 快速启动脚本
# 使用方法: ./start-with-qwen.sh

# 检查是否设置了 API KEY（支持两种环境变量名）
if [ -z "$DASHSCOPE_API_KEY" ] && [ -z "$QWEN_API_KEY" ]; then
    echo "错误: 未设置 API KEY 环境变量"
    echo "请先设置您的 Qwen API 密钥（任选其一）:"
    echo "  export DASHSCOPE_API_KEY=sk-your-key"
    echo "  或"
    echo "  export QWEN_API_KEY=sk-your-key"
    exit 1
fi

# 启用 Qwen 提供商
export CLAUDE_CODE_USE_QWEN=true

echo "正在启动 Claude Code with Qwen 3.6-Plus..."
if [ -n "$DASHSCOPE_API_KEY" ]; then
    echo "API Key: ${DASHSCOPE_API_KEY:0:10}..."
else
    echo "API Key: ${QWEN_API_KEY:0:10}..."
fi
echo "Model: qwen-plus-latest (预配置)"
echo "Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1 (预配置)"
echo ""

# 启动应用
bun run dev --model qwen
