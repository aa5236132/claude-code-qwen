@echo off
REM Qwen 3.6-Plus 快速启动脚本 (Windows)
REM 使用方法: start-with-qwen.bat

REM 检查是否设置了 API KEY（支持两种环境变量名）
if "%DASHSCOPE_API_KEY%"=="" if "%QWEN_API_KEY%"=="" (
    echo 错误: 未设置 API KEY 环境变量
    echo 请先设置您的 Qwen API 密钥（任选其一）:
    echo   set DASHSCOPE_API_KEY=sk-your-key
    echo   或
    echo   set QWEN_API_KEY=sk-your-key
    exit /b 1
)

REM 启用 Qwen 提供商
set CLAUDE_CODE_USE_QWEN=true

echo 正在启动 Claude Code with Qwen 3.6-Plus...
if not "%DASHSCOPE_API_KEY%"=="" (
    echo API Key: %DASHSCOPE_API_KEY:~0,10%...
) else (
    echo API Key: %QWEN_API_KEY:~0,10%...
)
echo Model: qwen-plus-latest (预配置)
echo Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1 (预配置)
echo.

REM 启动应用
bun run dev --model qwen
