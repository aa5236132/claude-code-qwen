# ✅ Qwen 配置简化 - 只需填写 API KEY

## 更新说明

根据阿里云 DashScope 的官方接入示例，已将 Qwen 配置简化为**只需填写 API KEY**，其他参数均已预配置。

## 官方接入示例

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),  # 只需配置 API KEY
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",  # 已预配置
)

messages = [{"role": "user", "content": "你是谁"}]
completion = client.chat.completions.create(
    model="qwen-plus-latest",  # 已预配置
    messages=messages,
    stream=True
)
```

## 简化后的配置

### UI 界面显示

在 "Setting up Qwen" 界面中，现在只显示：

```
Setting up Qwen

To use Qwen models, you only need to set your API key:

Step 1: Enable Qwen provider
  export CLAUDE_CODE_USE_QWEN=true

Step 2: Set your API key (get it from DashScope)
  export DASHSCOPE_API_KEY=sk-your-api-key-here
  or
  export QWEN_API_KEY=sk-your-api-key-here

Model: qwen-plus-latest (pre-configured)
Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1 (pre-configured)

Documentation:
· Get API Key: https://dashscope.console.aliyun.com/
· Documentation: See QWEN_INTEGRATION.md in repository
```

### 用户只需要做的事

1. **获取 API Key**
   - 访问 https://dashscope.console.aliyun.com/
   - 登录阿里云账号
   - 创建或获取 API Key

2. **设置两个环境变量**
   ```bash
   export CLAUDE_CODE_USE_QWEN=true
   export DASHSCOPE_API_KEY=sk-your-api-key-here
   ```

3. **启动使用**
   ```bash
   bun run dev --model qwen
   ```

## 预配置的参数

以下参数已在代码中预先配置，用户无需设置：

| 参数 | 预设值 | 说明 |
|------|--------|------|
| **模型名称** | `qwen-plus-latest` | 对应 Qwen 3.6-Plus |
| **API 端点** | `https://dashscope.aliyuncs.com/compatible-mode/v1` | DashScope OpenAI 兼容接口 |
| **API Key 变量** | `DASHSCOPE_API_KEY` 或 `QWEN_API_KEY` | 支持两种命名 |

## 技术实现

### 1. 更新 qwen.ts

```typescript
export const QWEN_DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
export const QWEN_DEFAULT_MODEL = 'qwen-plus-latest'

export function getQwenApiKey(): string | undefined {
  // 支持两种环境变量名
  return process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY
}
```

### 2. 更新 ConsoleOAuthFlow.tsx

简化配置说明，只显示必需的两个步骤：
- Step 1: 启用 Qwen 提供商
- Step 2: 设置 API Key

并明确标注模型和 Base URL 已预配置。

### 3. 更新文档

- **QWEN_INTEGRATION.md**: 强调只需配置 API Key
- **qwen.env.example**: 简化配置示例
- **启动脚本**: 支持两种 API Key 环境变量名

## 对比：简化前 vs 简化后

### 简化前 ❌

用户需要配置：
1. `CLAUDE_CODE_USE_QWEN=true`
2. `QWEN_API_KEY=...`
3. `QWEN_BASE_URL=...` (可选但显示在界面上)
4. 模型名称（不明确）

### 简化后 ✅

用户只需配置：
1. `CLAUDE_CODE_USE_QWEN=true`
2. `DASHSCOPE_API_KEY=...` (或 `QWEN_API_KEY`)

其他参数已预配置：
- ✅ 模型: `qwen-plus-latest`
- ✅ Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`

## 使用示例

### 最简配置

```bash
# 只需两行！
export CLAUDE_CODE_USE_QWEN=true
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxx

# 启动
bun run dev --model qwen
```

### 使用启动脚本

```bash
# 设置 API Key
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxx

# 运行脚本（会自动设置 CLAUDE_CODE_USE_QWEN）
./start-with-qwen.sh
```

### 使用配置文件

```bash
# 复制配置示例
cp qwen.env.example .env

# 编辑 .env，只需填写两项：
# CLAUDE_CODE_USE_QWEN=true
# DASHSCOPE_API_KEY=sk-your-key

# 启动
bun run dev --model qwen
```

## 环境变量支持

支持两种 API Key 环境变量名称（任选其一）：

1. **DASHSCOPE_API_KEY** (推荐，与官方示例一致)
   ```bash
   export DASHSCOPE_API_KEY=sk-your-key
   ```

2. **QWEN_API_KEY** (兼容性支持)
   ```bash
   export QWEN_API_KEY=sk-your-key
   ```

## 文件变更

### 修改的文件

1. **src/utils/model/qwen.ts**
   - 添加 `QWEN_DEFAULT_MODEL` 常量
   - 支持 `DASHSCOPE_API_KEY` 环境变量

2. **src/components/ConsoleOAuthFlow.tsx**
   - 简化 Qwen 配置说明
   - 只显示必需的两个步骤
   - 标注预配置的参数

3. **QWEN_INTEGRATION.md**
   - 更新为"快速开始"
   - 强调只需配置 API Key
   - 添加预配置说明表格

4. **qwen.env.example**
   - 简化配置示例
   - 标注预配置项

5. **start-with-qwen.sh / .bat**
   - 支持两种 API Key 环境变量
   - 显示预配置信息

### 新增的文档

1. **QWEN_SIMPLIFIED_CONFIG.md** (本文档)
   - 配置简化说明

## 优势

✅ **更简单**: 只需配置 API Key，无需关心其他参数  
✅ **更清晰**: UI 明确标注哪些已预配置  
✅ **更一致**: 与官方示例保持一致  
✅ **更友好**: 降低配置门槛，减少出错可能  

## 总结

现在用户使用 Qwen 模型只需：
1. 获取 API Key
2. 设置两个环境变量
3. 启动使用

所有其他配置（模型名称、API 端点）都已预先配置好，开箱即用！
