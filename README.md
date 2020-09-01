# library-tpl

使用 TS 编写 js 库时， [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) 是一个不错的选择，但是，该脚手架附加的内容过多，且更新不太及时。

这里对 [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) 进行了精简、升级：

1. 升级 rollup 开发依赖版本，增加 Terser Plugin 等
2. 保留 Jest、tslint 等
3. 移除 TypeDoc、Travis、Semantic release 等（需要注册诸多相关网站，配置累赘、复杂，弃之）

满足日常的工具库编译模版需求。

## 运行命令

```sh
yarn start          # 本地调试
yarn build          # 打包

yarn test           # Jest
yarn test:watch     # Jest & watch
yarn test:prod      # tslint & Jest

yarn commit         # 规范 commit
```

## 使用步骤

```sh
git clone https://github.com/alexjoverm/typescript-library-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run npm install and write your library name when asked. That's all!
yarn install
```
