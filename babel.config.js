module.exports = {
  loaderOptions: {
    /**
     * Babel 编译时，会处理 core-js（未来可能会被修复），
     * 导致 polyfill 内部代码发生了变化，产生一些微小的影响，如 Symbol 问题。
     * 暂时我们手动声明略过。
     * https://github.com/zloirock/core-js/issues/514
     * https://github.com/rails/webpacker/pull/2031
     */
    exclude: [/node_modules[\\/]core-js/],
  },
  assumptions: {
    /**
     * https://babeljs.io/docs/en/assumptions#setpublicclassfields
     *
     * 装饰器的 legancy: true，依赖此配置
     *  - https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
     */
    setPublicClassFields: true,
  },
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true,
        },
        useESModules: true,
      },
    ],
    [
      // @babel/plugin-proposal-decorators 需要在 @babel/plugin-proposal-class-properties 之前
      '@babel/plugin-proposal-decorators',
      {
        legacy: true, // 推荐
      },
    ],
    ['@babel/plugin-proposal-class-properties'],
  ],
};
