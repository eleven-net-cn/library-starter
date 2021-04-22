/* eslint-disable */
const inquirer = require('inquirer');
const { mv, rm, which, exec } = require('shelljs');
const replace = require('replace-in-file');
const colors = require('colors');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { fork } = require('child_process');

const rmDirs = ['.git', 'tools'];
const rmFiles = ['.gitattributes', 'tools/init.ts'];
const modifyFiles = [
  'package.json',
  'rollup.config.js',
  'rollup.config.ts',
  'test/library.test.ts',
];
const renameFiles = [
  ['src/library.ts', 'src/--libraryname--.ts'],
  ['test/library.test.ts', 'test/--libraryname--.test.ts'],
];

// Clear console
process.stdout.write('\x1B[2J\x1B[0f');

if (!which('git')) {
  console.log(colors.red('Sorry, this script requires git'));
  removeItems();
  process.exit(1);
}

// Generate the library name and start the tasks
if (process.env.CI == null) {
  libraryNameCreate();
} else {
  // This is being run in a CI environment, so don't ask any questions
  setupLibrary(libraryNameSuggested());
}

function libraryNameCreate() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'libraryName',
        message: `请确认 library name（小写字母、中划线连接）：`,
        default: libraryNameSuggested(),
        validate(libraryName: string) {
          // 校验版本号的格式
          if (!/^[a-z]+(\-[a-z]+)*$/.test(libraryName)) {
            console.log(colors.red('格式错误，请使用小写字母、中划线连接'));
            return false;
          }
          return true;
        },
      },
    ])
    .then(({ libraryName }: Record<'libraryName', string>) => {
      setupLibrary(libraryName);
    })
    .catch(() => {
      console.log(colors.red('library 初始化出错了~'));
      removeItems();
      process.exit(1);
    });
}

/**
 * 默认取 project dir 名称作为 library name
 */
function libraryNameSuggested() {
  return path
    .basename(path.resolve(__dirname, '..'))
    .replace(/[^\w\d]|_/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Calls all of the functions needed to setup the library
 *
 * @param libraryName
 */
function setupLibrary(libraryName: string) {
  console.log(colors.cyan('\nInitializing...\n'));

  // Get the Git username and email before the .git directory is removed
  const username = exec('git config user.name', { silent: true }).stdout.trim();
  const usermail = exec('git config user.email', { silent: true }).stdout.trim();

  removeItems();

  modifyContents(libraryName, username, usermail);

  renameItems(libraryName);

  finalize();

  console.log(colors.green('Success! The library initialization is complete.\n'));
  console.log('Inside that directory, you can run several commands:\n');

  console.log(colors.cyan('  yarn start'));
  console.log('    Starts the development compiler.\n');
  console.log(colors.cyan('  yarn test'));
  console.log('    Starts the jest runner.\n');
  console.log(colors.cyan('  yarn build'));
  console.log('    Bundles the library for production.\n');
}

/**
 * Removes items from the project that aren't needed after the initial setup
 */
function removeItems() {
  // The directories and files are combined here, to simplify the function,
  // as the 'rm' command checks the item type before attempting to remove it
  const rmItems = rmDirs.concat(rmFiles);
  rm(
    '-rf',
    rmItems.map(f => path.resolve(__dirname, '..', f))
  );
}

/**
 * Updates the contents of the template files with the library name or user details
 *
 * @param libraryName
 * @param username
 * @param usermail
 */
function modifyContents(libraryName: string, username: string, usermail: string) {
  const files = modifyFiles.map(f => path.resolve(__dirname, '..', f));
  try {
    replace.sync({
      files,
      from: [/--libraryname--/g, /--username--/g, /--usermail--/g],
      to: [libraryName, username, usermail],
    });
  } catch (error) {
    console.error('An error occurred modifying the file: ', error);
  }
}

/**
 * Renames any template files to the new library name
 *
 * @param libraryName
 */
function renameItems(libraryName: string) {
  renameFiles.forEach(function (files) {
    // Files[0] is the current filename
    // Files[1] is the new name
    const newFilename = files[1].replace(/--libraryname--/g, libraryName);
    mv(path.resolve(__dirname, '..', files[0]), path.resolve(__dirname, '..', newFilename));
  });
}

/**
 * Calls any external programs to finish setting up the library
 */
function finalize() {
  // Recreate Git folder
  exec('git init "' + path.resolve(__dirname, '..') + '"', {
    silent: true,
  }).stdout;

  // Remove post-install command
  const jsonPackage = path.resolve(__dirname, '..', 'package.json');
  const pkg = JSON.parse(readFileSync(jsonPackage) as any);
  const readme = path.resolve(__dirname, '..', 'README.md');

  // Note: Add items to remove from the package file here
  delete pkg.scripts.postinstall;

  writeFileSync(jsonPackage, JSON.stringify(pkg, null, 2));
  writeFileSync(readme, `# ${pkg.name}`);

  // Initialize Husky
  fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'), { silent: true });
}
