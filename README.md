# [library-starter](https://github.com/Eleven90/library-starter)

使用 TS 编写 js 库时， [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) 是一个不错的选择，但是，该脚手架附加的内容过多，更新不太及时，依赖包的版本滞后很多。

这里对 [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) 进行了精简、升级：

1. 【升级】 rollup 开发依赖版本，增加 Terser Plugin 等
2. 【升级】使用 Babel 编译 TypeScript 代码，而 tsc 仅用于：代码检查、生成声明文件等
3. 【升级】Jest 单元测试，放弃 ts-jest 转换测试代码
4. 【升级】使用 eslint 替换 tslint
2. 【优化】保留 TypeDoc 自动生成文档，并做升级优化
5. 【移除】移除 Travis、Semantic release 等（需要注册诸多相关网站，配置累赘、复杂，弃之）

满足日常的 js 库开发需求。

## Usage

1. clone 仓库代码

    ```sh
    git clone https://github.com/Eleven90/library-starter.git YOUR_PROJECT_FOLDER_NAME

    cd YOUR_PROJECT_FOLDER_NAME
    ```

2. `yarn install` 安装依赖包 & 命名 library（该名称会被处理成小驼峰变量，作为 UMD 模块挂载的全局变量）

    ```sh
    # Run yarn install and write your library name when asked. That's all!
    yarn install
    ```

## Command

```sh
yarn start          # 本地调试
yarn build          # 打包

yarn test           # Jest
yarn test:watch     # Jest & watch
yarn test:prod      # tslint & Jest

yarn lint           # tslint
```
