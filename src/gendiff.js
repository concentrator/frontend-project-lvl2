import { readFileSync } from 'node:fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';
import formatDiff from './formatters/index.js';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

const getExtension = (filepath) => {
  const ext = path.extname(filepath).split('.');
  return ext[ext.length - 1];
};

const getFormat = (filepath) => {
  const filename = path.basename(filepath).toLowerCase();
  const extension = getExtension(filename);
  if (extension === 'json') {
    return 'json';
  }
  if (extension === 'yml' || extension === 'yaml') {
    return 'yaml';
  }
  throw new Error('Unexpected file extension');
};

const parse = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
      return yaml.load(data);
    default:
      throw new Error('Unexpected format');
  }
};

const compareObjects = (obj1, obj2) => {
  const compareProp = (key) => {
    const firstValue = obj1[key];
    const secondValue = obj2[key];
    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return {
        name: key,
        type: 'parent',
        children: compareObjects(firstValue, secondValue),
      };
    }
    if (!Object.hasOwn(obj1, key)) {
      return {
        name: key,
        type: 'added',
        value: secondValue,
      };
    }
    if (!Object.hasOwn(obj2, key)) {
      return {
        name: key,
        type: 'deleted',
        value: firstValue,
      };
    }
    if (firstValue !== secondValue) {
      return {
        name: key,
        type: 'changed',
        firstValue,
        secondValue,
      };
    }
    return {
      name: key,
      type: 'unchanged',
      value: firstValue,
    };
  };
  const keys = _.sortBy(Object.keys({ ...obj1, ...obj2 }));
  const diff = keys.map(compareProp);
  return diff;
};

const buildDiff = (filepath1, filepath2) => {
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);

  const file1 = readFileSync(buildFullPath(filepath1));
  const file2 = readFileSync(buildFullPath(filepath2));

  const obj1 = parse(file1, format1);
  const obj2 = parse(file2, format2);

  const diff = compareObjects(obj1, obj2);

  return {
    type: 'parent',
    children: [...diff],
  };
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const diff = buildDiff(filepath1, filepath2);
  return formatDiff(diff, format);
};

export {
  getExtension,
  getFormat,
  parse,
  buildDiff,
};

export default genDiff;
