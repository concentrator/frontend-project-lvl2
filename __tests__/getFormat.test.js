import { test, expect } from '@jest/globals';
import { getFormat } from '../src/gendiff.js';

test('Get file format by extension', () => {
  expect(getFormat('file.yaml')).toBe('yaml');
  expect(getFormat('file.yml')).toBe('yaml');
  expect(getFormat('file.json')).toBe('json');
  expect(getFormat('/var/log/messages')).toBe(undefined);
  expect(getFormat('nginx.conf')).toBe(undefined);
});
