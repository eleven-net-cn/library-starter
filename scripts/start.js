'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const rollup = require('rollup');
const configFactory = require('../config/rollup.config');
const { registerShutdown, printError, relativePath } = require('../config/utils');

const configs = ['umd', 'cjs', 'es'].map(module => configFactory(module));
const watcher = rollup.watch(configs);

// when the process ends
registerShutdown(() => watcher.close());

watcher.on('event', event => {
  switch (event.code) {
    case 'START':
      break;
    case 'BUNDLE_START':
      console.log();
      console.log(`Compiling ${event.output.map(relativePath).join(', ')}...`);
      break;
    case 'BUNDLE_END':
      console.log(chalk.green(`Compiled successfully in ${chalk.bold(`${event.duration}ms`)}`));
      break;
    case 'END':
      console.log(
        `\n[${new Date()
          .toLocaleString('zh-CN', { hour12: false })
          .replace(',', '')}] Waiting for changes...`
      );
      break;
    case 'ERROR':
      printError(event.error);
      break;
    default:
      break;
  }
});
