import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result1 = readFileSync(getFixturePath('result_nested_stylish.txt'), { encoding: 'utf8', flag: 'r' });

test('Compare 2 JSON files, default params', () => {
  expect(genDiff(getFixturePath('file1_nested.json'), getFixturePath('file2_nested.json'))).toEqual(result1);
});

test('Compare 2 YAML files, default params', () => {
  expect(genDiff(getFixturePath('file1_nested.yml'), getFixturePath('file2_nested.yml'))).toEqual(result1);
});

const result2 = readFileSync(getFixturePath('result_nested_plain.txt'), { encoding: 'utf8', flag: 'r' });

test('Compare 2 JSON files, plain format', () => {
  expect(genDiff(getFixturePath('file1_nested.json'), getFixturePath('file2_nested.json'), 'plain')).toEqual(result2);
});

test('Compare 2 YAML files, plain format', () => {
  expect(genDiff(getFixturePath('file1_nested.yml'), getFixturePath('file2_nested.yml'), 'plain')).toEqual(result2);
});

const result3 = readFileSync(getFixturePath('result_nested_json.txt'), { encoding: 'utf8', flag: 'r' });

test('Compare 2 JSON files, json format', () => {
  expect(genDiff(getFixturePath('file1_nested.json'), getFixturePath('file2_nested.json'), 'json')).toEqual(result3);
});

test('Compare 2 YAML files, json format', () => {
  expect(genDiff(getFixturePath('file1_nested.yml'), getFixturePath('file2_nested.yml'), 'json')).toEqual(result3);
});
