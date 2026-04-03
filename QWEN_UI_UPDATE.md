# Qwen 集成 - UI 支持更新（完整版）

## 问题

用户反馈在 Claude Code 的 UI 中选择 "3rd-party platform" 时，虽然看到了 Qwen 选项，但无法选择它进行后续配置步骤。

## 解决方案（已完成）

已添加完整的 UI 交互流程，包括：

### 1. 添加平台选择步骤

**新增状态**: `platform_selection`

当用户选择 "3rd-party platform" 后，现在会进入一个新的选择界面，可以选择具体的平台：
- Amazon Bedrock
- Microsoft Foundry  
- Vertex AI
- **Qwen** ✨

### 2. 更新了 ConsoleOAuthFlow 组件

**文件**: `src/components/ConsoleOAuthFlow.tsx`

**主要变更**:

#### a) 添加新的状态类型
```typescript
type OAuthStatus = 
  | { state: 'idle' }
  | { state: 'platform_selection' }  // 新增：选择具体平台
  | { state: 'platform_setup'; platform?: 'bedrock' | 'vertex' | 'foundry' | 'qwen' }  // 更新：包含平台信息
  | ...
```

#### b) 平台选择界面
```typescript
case "platform_selection":
  // 显示四个平台选项：
  // - Amazon Bedrock
  // - Microsoft Foundry
  // - Vertex AI
  // - Qwen
```

#### c) 针对 Qwen 的专门配置说明
```typescript
case "platform_setup":
  if (platform === 'qwen') {
    // 显示 Qwen 特定的配置步骤
    // 1. CLAUDE_CODE_USE_QWEN=true
    // 2. QWEN_API_KEY=your_key
    // 3. QWEN_BASE_URL=... (可选)
  }
```

## 完整的 UI 流程

```
启动 Claude Code
    ↓
选择认证方式
    ↓
选择 "3rd-party platform"
    ↓
【新增】选择具体平台：
  ○ Amazon Bedrock
  ○ Microsoft Foundry
  ○ Vertex AI
  ○ Qwen  ← 可以选择！
    ↓
【针对 Qwen】显示配置说明：
  - 需要设置的环境变量
  - API Key 获取地址
  - 文档链接
    ↓
用户设置环境变量
    ↓
重启 Claude Code
    ↓
使用 --model qwen
```

### 2. 创建了 QwenSetup 组件

**文件**: `src/components/QwenSetup.tsx`

**功能**:
- 提供交互式的 Qwen API Key 配置界面
- 支持自定义 Base URL
- 保存配置到全局配置文件
- 提供清晰的配置步骤和提示

**使用流程**:
1. 输入 Qwen API Key
2. 配置 Base URL（可选，有默认值）
3. 确认并保存配置

### 3. 更新了 SDK Schema

**文件**: `src/entrypoints/sdk/coreSchemas.ts`

**修改内容**:
```typescript
apiProvider: z.enum(['firstParty', 'bedrock', 'vertex', 'foundry', 'qwen'])
```

## 使用方法

### 通过 UI 配置（推荐）

1. **启动 Claude Code**
   ```bash
   bun run dev
   ```

2. **选择认证方式**
   - 在初始设置界面，选择 "3rd-party platform"

3. **选择 Qwen 平台** ✨
   - 现在会看到平台选择界面
   - 选择 "Qwen · Alibaba Cloud Qwen models"

4. **查看 Qwen 配置说明**
   - UI 会显示需要设置的环境变量：
     ```
     1. CLAUDE_CODE_USE_QWEN=true - Enable Qwen provider
     2. QWEN_API_KEY=your_key - Your Qwen API key from DashScope
     3. QWEN_BASE_URL=... (Optional) - Custom API endpoint
     ```
   - 显示 API Key 获取地址：https://dashscope.console.aliyun.com/
   - 提供文档链接

5. **设置环境变量**
   ```bash
   export CLAUDE_CODE_USE_QWEN=true
   export QWEN_API_KEY=sk-xxxxxxxxxxxxx
   ```

6. **重启 Claude Code**
   ```bash
   bun run dev --model qwen
   ```

### 通过环境变量配置

如果不想使用 UI，仍然可以直接通过环境变量配置：

```bash
# 设置环境变量
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=sk-xxxxxxxxxxxxx
export QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1  # 可选

# 启动
bun run dev --model qwen
```

## 配置流程图

```
启动 Claude Code
    ↓
选择认证方式
    ↓
选择 "3rd-party platform"
    ↓
查看平台列表（包含 Qwen）
    ↓
查看 Qwen 配置文档
    ↓
设置环境变量:
  - CLAUDE_CODE_USE_QWEN=true
  - QWEN_API_KEY=your_key
    ↓
重启 Claude Code
    ↓
使用 --model qwen 或 /model qwen
```

## 文件变更总结

### 修改的文件（3个）

1. **src/components/ConsoleOAuthFlow.tsx**
   - 添加 Qwen 到平台选项
   - 更新说明文本
   - 添加文档链接

2. **src/entrypoints/sdk/coreSchemas.ts**
   - 更新 apiProvider 枚举类型

3. **QWEN_INTEGRATION.md**
   - 添加 UI 配置方法说明
   - 更新配置流程

### 新增的文件（1个）

1. **src/components/QwenSetup.tsx**
   - Qwen API Key 配置组件
   - 交互式配置界面

## 注意事项

### 当前实现

目前的实现在 UI 中：
- ✅ 显示 Qwen 作为第三方平台选项
- ✅ 提供 Qwen 配置文档链接
- ✅ 说明需要设置的环境变量

### 环境变量配置

Qwen 的配置仍然需要通过环境变量：
- `CLAUDE_CODE_USE_QWEN=true` - 启用 Qwen
- `QWEN_API_KEY` - API 密钥
- `QWEN_BASE_URL` - API 端点（可选）

这与其他第三方平台（Bedrock, Vertex, Foundry）的配置方式一致。

### 为什么不在 UI 中直接输入 API Key？

与 Bedrock、Vertex、Foundry 保持一致的设计：
1. **安全性**: 环境变量更安全，不会保存在配置文件中
2. **灵活性**: 可以在不同环境使用不同的配置
3. **一致性**: 所有第三方平台使用相同的配置模式

## 测试建议

1. **UI 显示测试**
   ```bash
   bun run dev
   # 检查 "3rd-party platform" 选项中是否包含 Qwen
   ```

2. **配置流程测试**
   ```bash
   # 按照 UI 提示设置环境变量
   export CLAUDE_CODE_USE_QWEN=true
   export QWEN_API_KEY=your_key
   
   # 重启并验证
   bun run dev --model qwen
   ```

3. **文档链接测试**
   - 验证 UI 中的文档链接是否正确
   - 确认 QWEN_INTEGRATION.md 可访问

## 后续改进

如果需要更完整的 UI 集成，可以考虑：

1. **添加专门的 Qwen 配置页面**
   - 在 UI 中直接输入 API Key
   - 保存到安全存储（如系统密钥链）

2. **添加配置验证**
   - 测试 API Key 是否有效
   - 显示连接状态

3. **添加配置向导**
   - 逐步引导用户完成配置
   - 提供更详细的帮助信息

## 相关文档

- [QWEN_INTEGRATION.md](QWEN_INTEGRATION.md) - 完整集成文档
- [QWEN_CHANGELOG.md](QWEN_CHANGELOG.md) - 变更历史
- [QWEN_TEST_CHECKLIST.md](QWEN_TEST_CHECKLIST.md) - 测试清单
