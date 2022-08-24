import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result = readFileSync(getFixturePath('result_nested.txt'), { encoding: 'utf8', flag: 'r' });

test('Compare 2 JSON files, default params', () => {
  expect(genDiff(getFixturePath('file1_nested.json'), getFixturePath('file2_nested.json'))).toEqual(result);
});

test('Compare 2 YAML files, default params', () => {
  expect(genDiff(getFixturePath('file1_nested.yml'), getFixturePath('file2_nested.yml'))).toEqual(result);
});
