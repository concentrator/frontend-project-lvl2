import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import { buildDiff } from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const result = {
  children: [
    {
      children: [
        {
          name: 'follow',
          type: 'added',
          value: false,
        },
        {
          name: 'setting1',
          type: 'unchanged',
          value: 'Value 1',
        },
        {
          name: 'setting2',
          type: 'deleted',
          value: 200,
        },
        {
          firstValue: true,
          name: 'setting3',
          secondValue: null,
          type: 'changed',
        },
        {
          name: 'setting4',
          type: 'added',
          value: 'blah blah',
        },
        {
          name: 'setting5',
          type: 'added',
          value: {
            key5: 'value5',
          },
        },
        {
          children: [
            {
              children: [
                {
                  firstValue: '',
                  name: 'wow',
                  secondValue: 'so much',
                  type: 'changed',
                },
              ],
              name: 'doge',
              type: 'parent',
            },
            {
              name: 'key',
              type: 'unchanged',
              value: 'value',
            },
            {
              name: 'ops',
              type: 'added',
              value: 'vops',
            },
          ],
          name: 'setting6',
          type: 'parent',
        },
      ],
      name: 'common',
      type: 'parent',
    },
    {
      children: [
        {
          firstValue: 'bas',
          name: 'baz',
          secondValue: 'bars',
          type: 'changed',
        },
        {
          name: 'foo',
          type: 'unchanged',
          value: 'bar',
        },
        {
          firstValue: {
            key: 'value',
          },
          name: 'nest',
          secondValue: 'str',
          type: 'changed',
        },
      ],
      name: 'group1',
      type: 'parent',
    },
    {
      name: 'group2',
      type: 'deleted',
      value: {
        abc: 12345,
        deep: {
          id: 45,
        },
      },
    },
    {
      name: 'group3',
      type: 'added',
      value: {
        deep: {
          id: {
            number: 45,
          },
        },
        fee: 100500,
      },
    },
  ],
  type: 'parent',
};

test('Compare 2 flat JSON files, default params', () => {
  expect(buildDiff(getFixturePath('file1_nested.json'), getFixturePath('file2_nested.json'))).toEqual(result);
});

test('Compare 2 flat YAML files, default params', () => {
  expect(buildDiff(getFixturePath('file1_nested.yml'), getFixturePath('file2_nested.yml'))).toEqual(result);
});
