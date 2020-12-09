import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
// import banner from 'rollup-plugin-banner'
import filesize from 'rollup-plugin-filesize'
import camelCase from 'lodash.camelcase'
import cleaner from 'rollup-plugin-cleaner'
import eslint from '@rbnlffl/rollup-plugin-eslint'
import pkg from './package.json'

const libraryName = '--libraryname--'
const isProd = process.env.NODE_ENV === 'production'

const pluginsProd = isProd
  ? [
      sourceMaps(),
      terser({
        compress: {
          drop_debugger: true,
        },
        output: {
          comments: false,
          ascii_only: true,
          beautify: false,
        },
      }),
      // banner(
      //   `${pkg.name} v${pkg.version}` +
      //     `\n` +
      //     `Author: ${pkg.author}` +
      //     `\n` +
      //     `Date: ${new Date()}`
      // ),
      filesize(),
      cleaner({
        targets: ['./dist/'],
      }),
    ]
  : []

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {},
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    /**
     * 不需要打包的第三方依赖，在 peerDependencies 中声明，将自动添加到 externnal 不参与打包。
     */
    peerDepsExternal(),
    commonjs(),
    nodeResolve({
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.json'],
    }),
    alias({
      entries: {
        '@': path.resolve(__dirname, 'src'),
      },
    }),
    json(),
    babel({
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      exclude: /node_modules/,
    }),
    eslint({
      extensions: ['.js', '.ts'],
      filterInclude: ['src/**'],
      filterExclude: ['node_modules/**'],
    }),
    ...pluginsProd,
  ],
}
