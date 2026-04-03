# Qwen 集成测试清单

## 修改文件清单

### 核心功能文件

1. ✅ **src/utils/model/qwen.ts** (新建)
   - Qwen API 配置工具函数
   - 提供 API Key 和 Base URL 获取方法

2. ✅ **src/utils/model/providers.ts** (修改)
   - 添加 `qwen` 作为新的 APIProvider 类型
   - 更新 getAPIProvider() 函数支持 Qwen

3. ✅ **src/utils/model/configs.ts** (修改)
   - 添加 QWEN_3_6_PLUS_CONFIG 配置
   - 为所有 Claude 模型配置添加 qwen 字段
   - 在 ALL_MODEL_CONFIGS 中注册 qwen36plus

4. ✅ **src/utils/model/aliases.ts** (修改)
   - 添加 'qwen' 到 MODEL_ALIASES
   - 添加 'qwen' 到 MODEL_FAMILY_ALIASES

5. ✅ **src/utils/model/model.ts** (修改)
   - 在 parseUserSpecifiedModel() 中添加 qwen 别名处理

6. ✅ **src/services/api/client.ts** (修改)
   - 添加 Qwen API 客户端初始化逻辑
   - 支持 CLAUDE_CODE_USE_QWEN 环境变量

### 文档和配置文件

7. ✅ **QWEN_INTEGRATION.md** (新建)
   - 完整的集成说明文档
   - 配置方法和使用示例

8. ✅ **README.md** (修改)
   - 添加 Qwen 支持说明

9. ✅ **qwen.env.example** (新建)
   - 环境变量配置示例

10. ✅ **start-with-qwen.sh** (新建)
    - Linux/Mac 快速启动脚本

11. ✅ **start-with-qwen.bat** (新建)
    - Windows 快速启动脚本

## 功能测试清单

### 基础配置测试

- [ ] 设置 CLAUDE_CODE_USE_QWEN=true
- [ ] 设置 QWEN_API_KEY
- [ ] 验证环境变量读取正常

### 模型别名测试

- [ ] 使用 `--model qwen` 启动
- [ ] 使用 `--model qwen-plus-latest` 启动
- [ ] 在运行时使用 `/model qwen` 切换

### API 客户端测试

- [ ] 验证 Qwen API 客户端正确初始化
- [ ] 验证 API Key 正确传递
- [ ] 验证 Base URL 配置生效

### 错误处理测试

- [ ] 未设置 QWEN_API_KEY 时的错误提示
- [ ] API Key 无效时的错误处理
- [ ] 网络连接失败时的错误处理

## 代码质量检查

### TypeScript 类型检查

```bash
# 检查类型定义是否正确
bun run tsc --noEmit
```

### 导入检查

- [ ] 所有新增的导入语句是否正确
- [ ] 循环依赖检查
- [ ] 模块路径是否正确

### 代码风格

- [ ] 遵循项目现有代码风格
- [ ] 注释清晰完整
- [ ] 变量命名规范

## 集成测试场景

### 场景 1: 基本使用

```bash
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=sk-xxxxx
bun run dev --model qwen
```

预期结果: 成功启动并使用 Qwen 模型

### 场景 2: 使用完整模型名

```bash
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=sk-xxxxx
export ANTHROPIC_MODEL=qwen-plus-latest
bun run dev
```

预期结果: 成功启动并使用 Qwen 模型

### 场景 3: 自定义 Base URL

```bash
export CLAUDE_CODE_USE_QWEN=true
export QWEN_API_KEY=sk-xxxxx
export QWEN_BASE_URL=https://custom.api.endpoint/v1
bun run dev --model qwen
```

预期结果: 使用自定义 API 端点

### 场景 4: 运行时切换模型

```bash
# 启动时使用 Claude
bun run dev

# 在运行时切换到 Qwen
/model qwen
```

预期结果: 成功切换到 Qwen 模型

## 兼容性检查

### 与现有功能的兼容性

- [ ] 不影响 Claude 模型的正常使用
- [ ] 不影响 Bedrock 集成
- [ ] 不影响 Vertex AI 集成
- [ ] 不影响 Foundry 集成

### 向后兼容性

- [ ] 未设置 CLAUDE_CODE_USE_QWEN 时，默认行为不变
- [ ] 现有配置文件继续有效
- [ ] 现有环境变量继续有效

## 文档完整性检查

- [ ] 所有配置选项都有文档说明
- [ ] 提供了完整的使用示例
- [ ] 包含故障排查指南
- [ ] 中英文文档都已更新

## 性能测试

- [ ] API 调用延迟测试
- [ ] 并发请求测试
- [ ] 长时间运行稳定性测试

## 安全检查

- [ ] API Key 不会被记录到日志
- [ ] 敏感信息不会暴露在错误消息中
- [ ] 环境变量安全处理

## 部署前检查

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 文档审查完成
- [ ] 版本号更新（如需要）
- [ ] CHANGELOG 更新（如需要）

## 已知限制

1. Qwen API 使用 OpenAI 兼容模式，某些 Claude 特有功能可能不支持
2. 需要阿里云账号和 DashScope 服务访问权限
3. API 调用会产生费用

## 后续改进建议

1. 添加更多 Qwen 模型支持（如 qwen-turbo, qwen-max 等）
2. 添加模型能力检测和自动降级
3. 优化错误提示和用户体验
4. 添加使用统计和成本追踪
5. 支持流式响应优化
