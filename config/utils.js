const path = require('path');
const chalk = require('chalk');

function printError(err) {
  let description = err.message || err;

  if (err.name) {
    description = `${err.name}: ${description}`;
  }
  const message = err.plugin ? `(plugin ${err.plugin}) ${description}` : description;

  console.error(chalk.bold(chalk.red(`[!] ${chalk.bold(message.toString())}`)));

  if (err.url) {
    console.error(chalk.cyan(err.url));
  }

  if (err.loc) {
    console.error(`${err.loc.file || err.id} (${err.loc.line}:${err.loc.column})`);
  } else if (err.id) {
    console.error(err.id);
  }

  if (err.frame) {
    console.error(chalk.dim(err.frame));
  }

  if (err.stack) {
    console.error(chalk.dim(err.stack));
  }
}

function registerShutdown(fn) {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
}

function relativePath(id) {
  if (!path.isAbsolute(id)) {
    return id;
  }
  return path.relative(process.cwd(), id);
}

function ensureArray(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }
  if (items) {
    return [items];
  }
  return [];
}

module.exports = {
  printError,
  registerShutdown,
  relativePath,
  ensureArray,
};
