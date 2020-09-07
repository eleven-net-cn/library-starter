import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import banner from 'rollup-plugin-banner'
import filesize from 'rollup-plugin-filesize'
import camelCase from 'lodash.camelcase'

const libraryName = '--libraryname--'
const pkg = require('./package.json')
const isProd = process.env.NODE_ENV === 'production'

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    alias({
      entries: {
        '@': path.resolve(__dirname, 'src'),
      },
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    nodeResolve(),
    // Resolve source maps to the original source
    isProd && sourceMaps(),
    isProd &&
      terser({
        compress: {
          drop_debugger: true
        },
        output: {
          comments: false,
          ascii_only: true,
          beautify: false
        }
      }),
    isProd &&
      banner(
        `${pkg.name} v${pkg.version}` +
          `\n` +
          `Author: ${pkg.author}` +
          `\n` +
          `Date: ${new Date()}`
      ),
    isProd && filesize()
  ]
}
