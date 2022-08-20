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
    state: 'deleted',
  },
  {
    key: 'host',
    oldValue: 'hexlet.io',
    newValue: 'hexlet.io',
    state: 'unchanged',
  },
  {
    key: 'proxy',
    oldValue: '123.234.53.22',
    newValue: undefined,
    state: 'deleted',
  },
  {
    key: 'timeout',
    oldValue: 50,
    newValue: 20,
    state: 'changed',
  },
  {
    key: 'verbose',
    oldValue: undefined,
    newValue: true,
    state: 'added',
  },
];

test('Compare 2 flat objects, default params', () => {
  expect(buildDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toEqual(result1);
});
