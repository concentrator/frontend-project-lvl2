import yaml from 'js-yaml';
import { test, expect } from '@jest/globals';
import { parse } from '../src/gendiff.js';

const dataJSON = `{
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}`;

test('Parse json data', () => {
  expect(parse(dataJSON, 'json')).toEqual(JSON.parse(dataJSON));
});

const dataYAML = `---
host: hexlet.io
timeout: 50
proxy: 123.234.53.22
follow: false`;

test('Parse yaml data', () => {
  expect(parse(dataYAML, 'yaml')).toEqual(yaml.load(dataYAML));
});

test('Parse unknown format', () => {
  expect(() => parse(dataYAML, 'conf')).toThrow('Unexpected format');
});
