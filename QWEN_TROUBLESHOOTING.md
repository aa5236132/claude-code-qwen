# Qwen 使用故障排查

## 问题 1: 进入界面后显示 "Not logged in"

### 症状
```
│     Sonnet 4.6 · API Usage Billing     │
│   /mnt/d/cluade code/claude-code-rev   │
╰────────────────────────────────────────╯

❯ 状态
  ⎿  Not logged in · Please run /login
```

### 原因
虽然设置了 Qwen 环境变量，但系统仍在使用默认的 Claude 模型，因此要求登录。

### 解决方案

#### 方案 1: 使用 /model 命令切换（推荐）
在当前界面中输入：
```
/model qwen
```

界面应该会显示：
```
│     Qwen · Alibaba Cloud Qwen models     │
```

#### 方案 2: 重新启动并指定模型
```bash
# 1. 按 Ctrl+C 退出当前界面

# 2. 确认环境变量已设置
echo $CLAUDE_CODE_USE_QWEN  # 应该显示 true
echo $DASHSCOPE_API_KEY     # 应该显示你的 API Key

# 3. 重新启动并指定模型
bun run dev --model qwen
```

#### 方案 3: 设置默认模型
在配置文件中设置默认模型：
```bash
# 创建或编辑 settings.json
{
  "model": "qwen"
}
```

然后重启：
```bash
bun run dev
```

## 问题 2: 环境变量设置后不生效

### 症状
设置了环境变量，但系统仍然提示未配置。

### 检查步骤

#### 1. 验证环境变量
```bash
echo $CLAUDE_CODE_USE_QWEN
# 应该输出: true

echo $DASHSCOPE_API_KEY
# 应该输出: sk-xxxxx...
```

#### 2. 确认在正确的终端设置
环境变量只在**当前终端会话**中有效。确保：
- 在**启动 Claude Code 的同一个终端**中设置环境变量
- 或者将环境变量添加到 `~/.bashrc` 或 `~/.zshrc` 中

#### 3. 使用 .env 文件（推荐）
```bash
# 1. 复制配置示例
cp qwen.env.example .env

# 2. 编辑 .env 文件
nano .env

# 3. 填入配置
CLAUDE_CODE_USE_QWEN=true
DASHSCOPE_API_KEY=sk-your-key

# 4. 启动
bun run dev --model qwen
```

## 问题 3: API Key 无效

### 症状
```
Error: Invalid API key
```

### 解决方案

#### 1. 验证 API Key 格式
Qwen API Key 应该以 `sk-` 开头：
```bash
echo $DASHSCOPE_API_KEY
# 正确格式: sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2. 检查 API Key 来源
确保从正确的地方获取 API Key：
- 访问: https://dashscope.console.aliyun.com/
- 登录阿里云账号
- 在 API-KEY 管理页面获取

#### 3. 检查 API Key 权限
确保 API Key 有权限访问 Qwen-Plus 模型。

## 问题 4: 模型切换后仍显示 Sonnet

### 症状
使用 `/model qwen` 后，界面仍显示 Sonnet。

### 解决方案

#### 1. 检查环境变量
```bash
# 必须设置这个环境变量
export CLAUDE_CODE_USE_QWEN=true
```

#### 2. 重启应用
```bash
# 1. 退出 (Ctrl+C)
# 2. 重新启动
bun run dev --model qwen
```

#### 3. 检查模型配置
```bash
# 查看当前模型
/config

# 应该显示: model: qwen
```

## 问题 5: 无法连接到 Qwen API

### 症状
```
Error: Connection timeout
Error: ECONNREFUSED
```

### 解决方案

#### 1. 检查网络连接
```bash
# 测试是否能访问 DashScope
curl -I https://dashscope.aliyuncs.com
```

#### 2. 检查代理设置
如果使用代理：
```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

#### 3. 检查防火墙
确保防火墙允许访问 `dashscope.aliyuncs.com`。

## 完整的工作流程示例

### 正确的启动流程

```bash
# 1. 设置环境变量
export CLAUDE_CODE_USE_QWEN=true
export DASHSCOPE_API_KEY=sk-your-actual-api-key-here

# 2. 验证环境变量
echo "QWEN enabled: $CLAUDE_CODE_USE_QWEN"
echo "API Key set: ${DASHSCOPE_API_KEY:0:10}..."

# 3. 启动并指定模型
bun run dev --model qwen

# 4. 验证模型
# 界面应该显示: Qwen · Alibaba Cloud Qwen models

# 5. 开始使用
你好
```

### 使用启动脚本（最简单）

```bash
# 1. 设置 API Key
export DASHSCOPE_API_KEY=sk-your-key

# 2. 运行脚本（会自动设置所有配置）
./start-with-qwen.sh

# 3. 直接开始使用
```

## 常见错误信息

### "QWEN_API_KEY environment variable is required"
**原因**: 未设置 API Key  
**解决**: `export DASHSCOPE_API_KEY=sk-your-key`

### "Not logged in · Please run /login"
**原因**: 未切换到 Qwen 模型  
**解决**: 使用 `/model qwen` 或 `--model qwen`

### "Model not found: qwen"
**原因**: 未启用 Qwen 提供商  
**解决**: `export CLAUDE_CODE_USE_QWEN=true`

### "Invalid model: qwen-plus-latest"
**原因**: API Key 无权限或无效  
**解决**: 检查 API Key 是否正确，是否有权限

## 验证配置清单

使用此清单确保所有配置正确：

- [ ] 环境变量 `CLAUDE_CODE_USE_QWEN=true` 已设置
- [ ] 环境变量 `DASHSCOPE_API_KEY=sk-xxx` 已设置
- [ ] API Key 格式正确（以 sk- 开头）
- [ ] 启动时使用了 `--model qwen` 参数
- [ ] 或在界面中使用了 `/model qwen` 命令
- [ ] 界面显示 "Qwen" 而不是 "Sonnet"
- [ ] 可以正常对话

## 获取帮助

如果以上方法都无法解决问题：

1. 检查完整的错误日志
2. 验证 API Key 在 DashScope 控制台中是否有效
3. 查看 QWEN_INTEGRATION.md 获取更多信息
4. 使用 `--verbose` 参数启动以获取详细日志：
   ```bash
   bun run dev --model qwen --verbose
   ```

## 推荐的最佳实践

1. **使用启动脚本**
   - 最简单，自动处理所有配置
   - `./start-with-qwen.sh`

2. **使用 .env 文件**
   - 配置持久化
   - 不会忘记设置环境变量

3. **始终指定模型**
   - 使用 `--model qwen` 启动
   - 或在界面中使用 `/model qwen`

4. **验证配置**
   - 启动后检查界面显示的模型名称
   - 确认显示 "Qwen" 而不是 "Sonnet"
