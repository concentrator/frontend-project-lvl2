import { test, expect } from '@jest/globals';
import genDiff from '../index.js';

// const file1 = `{
//   "host": "hexlet.io",
//   "timeout": 50,
//   "proxy": "123.234.53.22",
//   "follow": false
// }`;

// const file2 = `{
//   "timeout": 20,
//   "verbose": true,
//   "host": "hexlet.io"
// }`;

const result1 = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('Compare 2 JSON files, default params', () => {
  expect(genDiff('file1.json', 'file1.json')).toBe(result1);
});
