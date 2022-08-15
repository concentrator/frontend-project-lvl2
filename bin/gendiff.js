#!/usr/bin/env node

import { Command } from 'commander';
// import genDiff from '../index.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.1', '-V, --version', 'output the version number')
  .usage('[options] <filepath1> <filepath2>')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format (default: "stylish")');

program.parse(process.argv);
