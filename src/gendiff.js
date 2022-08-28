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
  let format;
  if (extension === 'json') {
    format = 'json';
  } else if (extension === 'yml' || extension === 'yaml') {
    format = 'yaml';
  }
  return format;
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
    const res = { name: key };
    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      res.type = 'parent';
      res.children = compareObjects(firstValue, secondValue);
      return res;
    }
    if (!Object.hasOwn(obj1, key)) {
      res.type = 'added';
      res.value = secondValue;
    } else if (!Object.hasOwn(obj2, key)) {
      res.type = 'deleted';
      res.value = firstValue;
    } else if (firstValue !== secondValue) {
      res.type = 'changed';
      res.firstValue = firstValue;
      res.secondValue = secondValue;
    } else {
      res.type = 'unchanged';
      res.value = firstValue;
    }
    return res;
  };
  const keys = Object.keys({ ...obj1, ...obj2 }).sort();
  const diff = keys.map(compareProp);
  return diff;
};

const buildDiff = (filepath1, filepath2) => {
  const file1 = readFileSync(buildFullPath(filepath1));
  const format1 = getFormat(filepath1);
  const file2 = readFileSync(buildFullPath(filepath2));
  const format2 = getFormat(filepath2);

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
