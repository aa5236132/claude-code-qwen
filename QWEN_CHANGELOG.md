# Qwen 3.6-Plus 集成变更摘要

## 概述

本次更新为 Claude Code 项目添加了对阿里云通义千问 Qwen 3.6-Plus 模型的完整支持，允许用户通过简单的环境变量配置即可切换到 Qwen 模型。

## 主要变更

### 1. 新增文件

#### 核心功能
- **src/utils/model/qwen.ts**
  - 提供 Qwen API 配置管理
  - 包含 API Key 和 Base URL 获取函数
  - 提供配置验证功能

#### 文档和配置
- **QWEN_INTEGRATION.md** - 完整的集成使用文档
- **QWEN_TEST_CHECKLIST.md** - 测试验证清单
- **qwen.env.example** - 环境变量配置示例
- **start-with-qwen.sh** - Linux/Mac 启动脚本
- **start-with-qwen.bat** - Windows 启动脚本

### 2. 修改文件

#### src/utils/model/providers.ts
```typescript
// 添加 qwen 作为新的 API 提供商类型
export type APIProvider = 'firstParty' | 'bedrock' | 'vertex' | 'foundry' | 'qwen'

// 更新提供商检测逻辑
export function getAPIProvider(): APIProvider {
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_QWEN)
    ? 'qwen'
    : // ... 其他提供商
}
```

#### src/utils/model/configs.ts
```typescript
// 添加 Qwen 模型配置
export const QWEN_3_6_PLUS_CONFIG = {
  firstParty: 'qwen-plus-latest',
  bedrock: 'qwen-plus-latest',
  vertex: 'qwen-plus-latest',
  foundry: 'qwen-plus-latest',
  qwen: 'qwen-plus-latest',
}

// 为所有 Claude 模型添加 qwen 字段
// 在 ALL_MODEL_CONFIGS 中注册 qwen36plus
```

#### src/utils/model/aliases.ts
```typescript
// 添加 qwen 别名
export const MODEL_ALIASES = [
  // ... 现有别名
  'qwen',
]

// 添加到模型家族别名
export const MODEL_FAMILY_ALIASES = ['sonnet', 'opus', 'haiku', 'qwen']
```

#### src/utils/model/model.ts
```typescript
// 在 parseUserSpecifiedModel 中添加 qwen 处理
case 'qwen':
  return getModelStrings().qwen36plus
```

#### src/services/api/client.ts
```typescript
// 添加 Qwen API 客户端初始化
if (isEnvTruthy(process.env.CLAUDE_CODE_USE_QWEN)) {
  const { getQwenApiKey, getQwenBaseUrl } = await import('../../utils/model/qwen.js')
  
  const qwenApiKey = getQwenApiKey()
  if (!qwenApiKey) {
    throw new Error('QWEN_API_KEY environment variable is required')
  }

  const clientConfig = {
    apiKey: qwenApiKey,
    baseURL: getQwenBaseUrl(),
    ...ARGS,
  }

  return new Anthropic(clientConfig)
}
```

#### README.md
- 在"当前状态"部分添加 Qwen 支持说明
- 添加指向 QWEN_INTEGRATION.md 的链接

## 技术实现细节

### API 集成方式

Qwen API 通过阿里云 DashScope 的 OpenAI 兼容模式接入：
- **Base URL**: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- **认证方式**: Bearer Token (API Key)
- **协议**: 与 Anthropic SDK 兼容

### 配置优先级

模型选择遵循以下优先级：
1. 命令行参数 `--model qwen`
2. 环境变量 `ANTHROPIC_MODEL=qwen`
3. 配置文件 `settings.json` 中的 `model` 字段
4. 默认模型

### 环境变量

新增环境变量：
- `CLAUDE_CODE_USE_QWEN` - 启用 Qwen 提供商（必需）
- `QWEN_API_KEY` - Qwen API 密钥（必需）
- `QWEN_BASE_URL` - 自定义 API 端点（可选）

## 使用方法

### 快速开始

```bash
# 设置环境变量
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=your_api_key

# 启动应用
bun run dev --model qwen
```

### 使用启动脚本

```bash
# Linux/Mac
./start-with-qwen.sh

# Windows
start-with-qwen.bat
```

### 使用配置文件

```bash
# 复制配置示例
cp qwen.env.example .env

# 编辑 .env 文件，填入 API Key
# 然后启动
bun run dev
```

## 兼容性

### 向后兼容
- ✅ 不影响现有 Claude 模型使用
- ✅ 不影响其他第三方提供商（Bedrock, Vertex, Foundry）
- ✅ 未启用时，默认行为完全不变

### 功能兼容
- ✅ 支持模型别名系统
- ✅ 支持运行时模型切换
- ✅ 支持配置文件和环境变量
- ⚠️ 某些 Claude 特有功能可能不支持（取决于 Qwen API）

## 测试建议

1. **基础功能测试**
   - 验证环境变量配置
   - 验证模型别名解析
   - 验证 API 客户端初始化

2. **集成测试**
   - 完整的对话流程测试
   - 模型切换测试
   - 错误处理测试

3. **兼容性测试**
   - 与现有功能的兼容性
   - 多提供商切换测试

详细测试清单请参考 [QWEN_TEST_CHECKLIST.md](QWEN_TEST_CHECKLIST.md)

## 已知限制

1. Qwen API 使用 OpenAI 兼容模式，某些 Claude 特有的 API 特性可能不支持
2. 需要有效的阿里云账号和 DashScope 服务访问权限
3. API 调用会产生费用，请注意成本控制

## 后续改进方向

1. **模型扩展**
   - 支持更多 Qwen 模型变体（qwen-turbo, qwen-max 等）
   - 添加模型能力检测

2. **功能增强**
   - 优化错误提示和用户体验
   - 添加使用统计和成本追踪
   - 支持流式响应优化

3. **文档完善**
   - 添加更多使用示例
   - 提供性能对比数据
   - 完善故障排查指南

## 相关文档

- [QWEN_INTEGRATION.md](QWEN_INTEGRATION.md) - 完整集成文档
- [QWEN_TEST_CHECKLIST.md](QWEN_TEST_CHECKLIST.md) - 测试清单
- [qwen.env.example](qwen.env.example) - 配置示例

## 贡献者

本次集成由 Claude Sonnet 4.6 协助完成。

## 版本信息

- 集成日期: 2026-04-03
- 基础版本: Claude Code 999.0.0-restored
- Qwen 模型: qwen-plus-latest (Qwen 3.6-Plus)
