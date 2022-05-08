'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const typescript = require('typescript');
const rollup = require('rollup');
const spawn = require('cross-spawn');
const configFactory = require('../config/rollup.config');
const { printError, relativePath, ensureArray } = require('../config/utils');

const configs = ['umd', 'cjs', 'es'].map(module => configFactory(module));

fs.emptyDirSync(path.resolve(__dirname, '../dist'));

build();

async function build() {
  try {
    const startAt = Date.now();

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      const output = ensureArray(config.output);
      const outputFiles = output.map(o => relativePath(o.file));
      console.log(
        chalk.cyan(`\n${chalk.bold(config.input)} → ${chalk.bold(outputFiles.join(', '))}...`)
      );
      const bundle = await rollup.rollup(config);
      await Promise.all(output.map(bundle.write));
      const time = ((Date.now() - startAt) / 1000).toFixed(2);

      console.log(
        chalk.green(`Created ${chalk.bold(outputFiles.join(', '))} in ${chalk.bold(`${time}ms`)}`)
      );
    }

    console.log();
    emitTypes();
  } catch (error) {
    printError(error);
  }
}

function emitTypes() {
  const startAt = Date.now();
  const proc = spawn.sync('tsc', ['--noEmit', 'false', '--declaration', '--emitDeclarationOnly'], {
    stdio: 'inherit',
  });

  if (proc.status !== 0) {
    console.log('\nError: 输出 types 失败\n');
    return;
  }

  console.log(
    chalk.green(
      `Created ${chalk.bold('dist/types')} in ${chalk.bold(
        `${((Date.now() - startAt) / 1000).toFixed(2)}s`
      )}`
    )
  );
}
