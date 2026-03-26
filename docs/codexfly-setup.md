# Codex `codexfly` 启动别名配置说明

这份文档用于给团队统一配置一个高权限的 Codex 启动别名：

```zsh
alias codexfly='codex --search --sandbox=danger-full-access --ask-for-approval=never'
```

适用场景：

- 需要让 Codex 直接执行命令，不再逐条请求确认
- 需要启用网页搜索能力
- 需要在本机本地开发环境里快速排障、改代码、跑命令

不适用场景：

- 不信任当前仓库、当前提示词或当前任务来源
- 需要严格限制文件读写范围
- 团队成员不清楚 `danger-full-access` 的风险

## 这条配置是什么意思

`codexfly` 只是一个 shell 别名，输入 `codexfly` 时，实际执行的是：

```bash
codex --search --sandbox=danger-full-access --ask-for-approval=never
```

参数说明：

- `--search`
  启用 Codex 的网页搜索能力
- `--sandbox=danger-full-access`
  关闭沙箱限制，允许命令按当前用户权限直接执行
- `--ask-for-approval=never`
  不再弹出审批确认，命令直接执行

## 风险说明

这套配置属于高风险模式，团队使用前必须明确下面几点：

- Codex 可能直接删除、修改、移动文件
- Codex 可能直接安装依赖、修改本地环境配置
- 如果提示词或上下文有误，错误操作也可能被直接执行
- 不建议在不熟悉的仓库或生产相关目录中直接使用

建议只在下面场景中使用：

- 本地开发仓库
- 团队内部可信任务
- 明确知道当前命令可能造成什么影响

## macOS + zsh 配置步骤

适用于默认 shell 为 `zsh` 的 macOS 环境。

1. 打开 `~/.zshrc`

```zsh
nvim ~/.zshrc
```

2. 在文件末尾追加下面这行：

```zsh
alias codexfly='codex --search --sandbox=danger-full-access --ask-for-approval=never'
```

3. 保存并退出 `nvim`

```vim
:wq
```

4. 重新加载 shell 配置

```zsh
source ~/.zshrc
```

5. 验证别名是否生效

```zsh
alias codexfly
```

期望输出：

```zsh
codexfly='codex --search --sandbox=danger-full-access --ask-for-approval=never'
```

6. 启动 Codex

```zsh
codexfly
```

## 常见问题

### 1. 为什么不加 `-c sandbox_workspace_write.network_access=true`

因为这里已经使用了：

```bash
--sandbox=danger-full-access
```

这时再追加 `sandbox_workspace_write.network_access=true` 基本没有实际价值。那个配置项主要是给 `workspace-write` 沙箱模式用的，不是给 `danger-full-access` 兜底的。

### 2. 如果团队成员用的是 bash 怎么办

把配置写到 `~/.bashrc` 或 `~/.bash_profile`，然后执行：

```bash
source ~/.bashrc
```

或：

```bash
source ~/.bash_profile
```

### 3. 如何移除这个别名

从对应 shell 配置文件里删掉这一行：

```zsh
alias codexfly='codex --search --sandbox=danger-full-access --ask-for-approval=never'
```

然后重新加载配置：

```zsh
source ~/.zshrc
```

## 推荐团队约定

为了避免有人把高权限模式当日常默认值乱用，建议团队内部约定：

- `codexfly` 只用于本地开发和可信仓库
- 涉及删除、重置、批量覆盖时，先看清命令再继续
- 不要在生产机器或敏感目录下直接使用
- 需要保守模式时，另配一个受限别名，例如 `codexsafe`

示例：

```zsh
alias codexsafe='codex --search --sandbox=workspace-write --ask-for-approval=on-request -c sandbox_workspace_write.network_access=true'
```
