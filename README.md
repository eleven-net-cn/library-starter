# [library-starter](https://github.com/eleven-net-cn/library-starter)

快速生成 TypeScript 类库、SDK 开发环境

- ✅ 提供 rollup 编译环境，输出 es module、commonjs 和 umd 模块代码
  - Babel 编译 TypeScript 代码
  - TSC 代码检查、生成声明文件
- ✅ 提供 Jest 单元测试
  - 使用 ts-jest 转换测试代码、test 目录的 TypeScript 代码检查
- ✅ 提供 demo 测试目录，vite 运行调试
- ✅ 集成 `standard-version` 自动添加 version、changelog
- ✅ 代码规范约束
  - 集成 eslint、prettier，`commit` 提交时自动格式化代码（lint-staged）
  - 强制规范 commit message（commitlint、commitizen）

## Usage

执行以下两步操作，快速创建项目，并完成初始化。

1. clone repository，创建项目

   推荐确定好项目文件夹名称，示例：my-lib。

   ```zsh
   git clone https://github.com/eleven-net-cn/library-starter.git my-lib
   ```

   ![clone_repo.gif](https://static.eleven.net.cn/images/library/clone_repo.gif)

2. 安装依赖，完成项目初始化

   ```zsh
   yarn install
   ```

   ![set_library_name.gif](https://static.eleven.net.cn/images/library/init.gif?v=1619061818612)

   依赖安装结束后，将触发 npm 的 `postinstall` 钩子，自动运行初始化脚本。请根据提示输入或确认 library name，随后将自动完成项目全部初始化工作。

   > UMD 模块会将 library name 转换为大驼峰，在 `window`、`global` 全局挂载。例如：library 名称为 `my-lib`，默认情况下，UMD 模块挂载的全局变量是 `window.MyLib`、`global.MyLib`。

## Command

```sh
yarn start          # 本地调试 & tsc 类型检查（src 目录）
yarn build          # 打包 & 类型检查 & 生成声明文件
yarn demo           # 运行 demo 测试（vite）
yarn test           # 启动 Jest 测试 & 查看测试覆盖率 & 类型检查（test 目录）

yarn release            # 根据 commit 提交，自动升级 version、生成 CHANGELOG.md
yarn release:patch      # 自动升级小版本号、生成 CHANGELOG.md
yarn release:minor      # 自动升级次版本号、生成 CHANGELOG.md
yarn release:major      # 自动升级主版本号、生成 CHANGELOG.md

yarn commit         # 交互式书写 commit message
yarn lint           # 运行 eslint，查看 lint 提示
yarn lint:fix       # 运行 eslint & 自动 fix 代码
```

## Remark

1. 输出 `cjs`、`esm` 模块时，`dependencies`、`peerDependencies` 中的依赖包，都会自动被加入到 rollup 的 externals 中，最终不会打包到 `dist` 产物。

2. 输出 `umd` 模块时，仅 `peerDependencies` 中的依赖包会被自动加入到 rollup 的 externals 中。

   记得在 `rollup.config.js` 文件中，`umd` 模块的 `output` 位置，找到 `globals` 配置，添加该依赖包外部引入的全局对象名。

3. 类库代码中使用到的新 ES API（例如：`includes()`、`padStart()` 等新 API），会自动从 `@babel/runtime-corejs3` 按需引入使用到的 api polyfill，并且不会污染原型链，你无需额外担心这些兼容问题。

   输出 `umd` 模块时，使用到的 api polyfill 会自动被按需编译到 `dist` 产物中。

   而输出 `cjs`、`esm` 模块时不会编译到 `dist`，`@babel/runtime-corejs3` 仅仅作为 `dependencies` 依赖被默认安装，自动按需引入 api polyfill。

   但是，如果你使用的第三方依赖包，自身未做好 api polyfill 兼容，你可以有以下选择：

   - 自己去弄清楚第三方依赖的兼容问题有哪些，从 [core-js](https://github.com/zloirock/core-js) 手动引入相关的 api polyfill。

   - 或者，去修改 babel 相关配置，将 `node_modules` 中的第三方依赖包加入到 babel 配置的 `include` 中，编译时一并处理。

   - 或者，不做兼容，而是提醒使用方做好对应兼容。
