import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import { buildDiff } from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result1 = [
  {
    key: 'follow',
    oldValue: false,
    newValue: undefined,
    type: 'deleted',
  },
  {
    key: 'host',
    oldValue: 'hexlet.io',
    newValue: 'hexlet.io',
    type: 'unchanged',
  },
  {
    key: 'proxy',
    oldValue: '123.234.53.22',
    newValue: undefined,
    type: 'deleted',
  },
  {
    key: 'timeout',
    oldValue: 50,
    newValue: 20,
    type: 'changed',
  },
  {
    key: 'verbose',
    oldValue: undefined,
    newValue: true,
    type: 'added',
  },
];

test('Compare 2 flat JSON files, default params', () => {
  expect(buildDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(result1);
});

test('Compare 2 flat YAML files, default params', () => {
  expect(buildDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toEqual(result1);
});
