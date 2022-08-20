import { test, expect } from '@jest/globals';
import { getExtension } from '../src/gendiff.js';

test('Get file extension', () => {
  expect(getExtension('/etc/nginx.conf')).toBe('conf');
  expect(getExtension('file.yaml')).toBe('yaml');
  expect(getExtension('/var/log/messages')).toBe('');
});
