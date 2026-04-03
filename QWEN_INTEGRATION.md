# Qwen 3.6-Plus 集成说明

本项目已添加对阿里云通义千问 Qwen 3.6-Plus 模型的支持。

## 快速开始

只需三步即可使用 Qwen 模型：

### 方式 1: 直接启动（最简单，推荐）

```bash
# 1. 设置环境变量
export CLAUDE_CODE_USE_QWEN=true
export DASHSCOPE_API_KEY=sk-your-api-key-here

# 2. 启动并指定模型
bun run dev --model qwen

# 3. 直接开始使用！
```

### 方式 2: 通过 UI 配置

1. **启动 Claude Code**
   ```bash
   bun run dev
   ```

2. **在 UI 中选择 Qwen**
   - 选择 "3rd-party platform"
   - 选择 "Qwen"
   - 查看配置说明

3. **设置环境变量**（在另一个终端窗口）
   ```bash
   export CLAUDE_CODE_USE_QWEN=true
   export DASHSCOPE_API_KEY=sk-your-api-key-here
   ```

4. **按 Enter 继续**
   - 返回 Claude Code 界面
   - 按 Enter 键进入编程界面

5. **切换到 Qwen 模型**
   ```
   /model qwen
   ```

6. **开始使用**
   - 现在可以使用 Qwen 模型了！

**重要提示**: 
- 设置环境变量后，需要使用 `--model qwen` 启动或在界面中使用 `/model qwen` 切换
- 否则系统会使用默认的 Claude 模型并要求登录

### 方式 2: 通过环境变量配置

```bash
# 必需：启用 Qwen 提供商
export CLAUDE_CODE_USE_QWEN=true

# 必需：Qwen API 密钥（从阿里云 DashScope 获取）
# 支持两种环境变量名称：
export DASHSCOPE_API_KEY=sk-your-api-key-here
# 或
export QWEN_API_KEY=sk-your-api-key-here

# 以下配置已预设，通常无需修改：
# - 模型: qwen-plus-latest
# - API 端点: https://dashscope.aliyuncs.com/compatible-mode/v1
```

### 获取 API 密钥

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 登录您的阿里云账号
3. 在 API-KEY 管理页面创建或获取您的 API 密钥
4. 将密钥设置到 `QWEN_API_KEY` 环境变量

### 使用模型

配置完成后，可以通过以下方式使用 Qwen 模型：

#### 方式 1：使用模型别名

```bash
# 使用 qwen 别名（推荐）
bun run dev --model qwen

# 或在运行时切换
/model qwen
```

#### 方式 2：使用完整模型名称

```bash
# 使用完整的模型 ID
bun run dev --model qwen-plus-latest

# 或通过环境变量
export ANTHROPIC_MODEL=qwen-plus-latest
bun run dev
```

#### 方式 3：在配置文件中设置

在 `settings.json` 中添加：

```json
{
  "model": "qwen"
}
```

## 支持的模型

当前支持的 Qwen 模型：

- `qwen-plus` - Qwen 3.6-Plus 最新版本（已预配置，通过别名 `qwen` 访问）

## 预配置说明

为了简化配置，以下参数已预先设置：

| 配置项 | 预设值 | 说明 |
|--------|--------|------|
| 模型名称 | `qwen-plus` | 对应 Qwen 3.6-Plus |
| API 端点 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 阿里云 DashScope OpenAI 兼容接口 |
| API Key 环境变量 | `DASHSCOPE_API_KEY` 或 `QWEN_API_KEY` | 支持两种命名方式 |

**您只需要**：
1. 获取 API Key
2. 设置环境变量
3. 启动使用

## 技术实现

### API 兼容性

Qwen API 使用 OpenAI 兼容模式，参考官方示例：

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)

messages = [{"role": "user", "content": "你是谁"}]
completion = client.chat.completions.create(
    model="qwen-plus",
    messages=messages,
    stream=True
)
```

Claude Code 的实现与此完全兼容。

### 修改的文件

1. **src/utils/model/qwen.ts** - 新增 Qwen API 配置工具函数
2. **src/utils/model/providers.ts** - 添加 `qwen` 作为新的 API 提供商
3. **src/utils/model/configs.ts** - 添加 Qwen 模型配置
4. **src/utils/model/aliases.ts** - 添加 `qwen` 模型别名
5. **src/utils/model/model.ts** - 在模型解析逻辑中添加 Qwen 支持
6. **src/services/api/client.ts** - 添加 Qwen API 客户端初始化逻辑

### API 兼容性

Qwen API 使用 OpenAI 兼容模式，通过阿里云 DashScope 的兼容接口访问：
- 基础 URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- 认证方式: Bearer Token (API Key)
- 协议: 与 Anthropic SDK 兼容

## 注意事项

1. **API 配额**: 请确保您的阿里云账户有足够的 API 调用配额
2. **网络访问**: 确保您的网络可以访问阿里云 DashScope 服务
3. **模型能力**: Qwen 模型的能力和特性可能与 Claude 模型有所不同
4. **费用**: 使用 Qwen API 会产生费用，请参考阿里云的定价说明

## 故障排查

### 问题：API 密钥错误

```
Error: QWEN_API_KEY environment variable is required when CLAUDE_CODE_USE_QWEN is enabled
```

**解决方案**: 确保已正确设置 `QWEN_API_KEY` 环境变量

### 问题：网络连接失败

**解决方案**: 
- 检查网络连接
- 确认可以访问 `dashscope.aliyuncs.com`
- 如果使用代理，确保代理配置正确

### 问题：模型不可用

**解决方案**: 
- 确认您的 API 密钥有权限访问 Qwen-Plus 模型
- 检查阿里云控制台中的模型服务状态

## 示例

### 完整的启动命令

```bash
# 设置环境变量并启动
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=sk-xxxxxxxxxxxxx
bun run dev --model qwen
```

### 在代码中使用

```typescript
// 检查是否配置了 Qwen
import { isQwenConfigured } from './src/utils/model/qwen.js'

if (isQwenConfigured()) {
  console.log('Qwen API is configured')
}
```

## 更多信息

- [阿里云 DashScope 文档](https://help.aliyun.com/zh/dashscope/)
- [Qwen 模型介绍](https://qwenlm.github.io/)
- [API 定价](https://dashscope.console.aliyun.com/billing)
