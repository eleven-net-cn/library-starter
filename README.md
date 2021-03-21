# [library-starter](https://github.com/eleven-net-cn/library-starter)

自动生成 TypeScript 类库、SDK 开发的初始化代码，提供 rollup 编译等必备配置。

提供以下特性：

- Babel 编译 TypeScript 代码，tsc 代码检查、生成声明文件等
- Jest 单元测试，使用 ts-jest 转换测试代码、`test` 目录的 Typescript 代码检查
- 提供 `demo` 测试目录，parcel 转换运行相关测试代码
- 保持统一的代码规范，commit 提交时自动格式化代码（eslint、prettier、lint-staged）
- 强制规范 `git commit` 提交（commitlint、commitizen）

## Usage

执行以下两步操作，即可快速完成初始化。

```zsh
# clone repository
git clone https://github.com/eleven-net-cn/library-starter.git

# install deps & 确认 UMD 模块全局对象名称
yarn install
```

> `install` 安装完包以后，会提示输入 `library` 名称，该 `library` 名称会被处理成小驼峰变量，作为 `UMD` 模块挂载到 window、global 的全局变量。  
> 例如：`library` 名称为 `my-lib`，默认情况下，`UMD` 模块挂载的全局变量是 `window.myLib`、`global.myLib`。

## Command

```sh
yarn start          # 本地调试 & tsc 类型检查（src 目录）
yarn build          # 打包 & 类型检查 & 生成声明文件
yarn demo           # 运行 demo 测试
yarn test           # 启动 Jest 测试 & 查看测试覆盖率 & 类型检查（test 目录）

yarn release            # 根据 commit 提交，自动升级 version、生成 CHANGELOG.md
yarn release:patch      # 自动升级小版本号、生成 CHANGELOG.md
yarn release:minor      # 自动升级次版本号、生成 CHANGELOG.md
yarn release:major      # 自动升级主版本号、生成 CHANGELOG.md

yarn commit         # 交互式书写 commit message
yarn lint           # 运行 eslint，查看 lint 提示
yarn lint:fix       # 运行 eslint & 自动 fix 代码
```
