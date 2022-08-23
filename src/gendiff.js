import { readFileSync } from 'node:fs';
import path from 'path';
import yaml from 'js-yaml';
// import _ from 'lodash';

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

const compareProp = (key, obj1, obj2) => {
  const oldValue = obj1[key];
  const newValue = obj2[key];
  const res = { key, oldValue, newValue };
  if (!Object.hasOwn(obj1, key)) {
    res.type = 'added';
  } else if (!Object.hasOwn(obj2, key)) {
    res.type = 'deleted';
  } else if (oldValue !== newValue) {
    res.type = 'changed';
  } else {
    res.type = 'unchanged';
  }
  return res;
};

const compareObjects = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 }).sort();
  return keys.map((key) => compareProp(key, obj1, obj2));
};

const formatToStylish = (diff) => {
  const spacer = '  ';
  const minus = '- ';
  const plus = '+ ';
  const result = diff.reduce((acc, item, index) => {
    const isLastLine = (index === diff.length - 1);
    const lineBreak = '\n';
    const eol = isLastLine ? '\n}' : '\n';
    const { key, oldValue, newValue } = item;
    let line = '';
    if (item.type === 'unchanged') {
      line = `${spacer.repeat(2)}${key}: ${newValue}${eol}`;
    }
    if (item.type === 'changed') {
      line = `${spacer}${minus}${key}: ${oldValue}${lineBreak}${spacer}${plus}${key}: ${newValue}${eol}`;
    }
    if (item.type === 'deleted') {
      line = `${spacer}${minus}${key}: ${oldValue}${eol}`;
    }
    if (item.type === 'added') {
      line = `${spacer}${plus}${key}: ${newValue}${eol}`;
    }
    return `${acc}${line}`;
  }, '{\n');
  return result;
};

const formatDiff = (diff, format) => {
  switch (format) {
    case 'stylish':
      return formatToStylish(diff);
    default:
      throw new Error('Unexpected format');
  }
};

const buildDiff = (filepath1, filepath2) => {
  const file1 = readFileSync(buildFullPath(filepath1));
  const format1 = getFormat(filepath1);
  const file2 = readFileSync(buildFullPath(filepath2));
  const format2 = getFormat(filepath2);

  const obj1 = parse(file1, format1);
  const obj2 = parse(file2, format2);

  return compareObjects(obj1, obj2);
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
