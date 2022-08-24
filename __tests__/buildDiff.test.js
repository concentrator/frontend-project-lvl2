import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import { buildDiff } from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result1 = [
  {
    name: 'follow',
    value: false,
    type: 'deleted',
  },
  {
    name: 'host',
    value: 'hexlet.io',
    type: 'unchanged',
  },
  {
    name: 'proxy',
    value: '123.234.53.22',
    type: 'deleted',
  },
  {
    name: 'timeout',
    firstValue: 50,
    secondValue: 20,
    type: 'changed',
  },
  {
    name: 'verbose',
    value: true,
    type: 'added',
  },
];

test('Compare 2 flat JSON files, default params', () => {
  expect(buildDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(result1);
});

test('Compare 2 flat YAML files, default params', () => {
  expect(buildDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toEqual(result1);
});
