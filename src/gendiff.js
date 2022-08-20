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
    res.state = 'added';
  } else if (!Object.hasOwn(obj2, key)) {
    res.state = 'deleted';
  } else if (oldValue !== newValue) {
    res.state = 'changed';
  } else {
    res.state = 'unchanged';
  }
  return res;
};

const compareObjects = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 }).sort();
  return keys.map((key) => compareProp(key, obj1, obj2));
};

const formatToStylish = (diff) => {
  const result = diff.reduce((acc, item) => {
    const res = {};
    const key = `  ${item.key}`;
    const keyMinus = `- ${item.key}`;
    const keyPlus = `+ ${item.key}`;
    if (item.state === 'unchanged') {
      res[key] = item.newValue;
    }
    if (item.state === 'changed') {
      res[keyMinus] = item.oldValue;
      res[keyPlus] = item.newValue;
    }
    if (item.state === 'deleted') {
      res[keyMinus] = item.oldValue;
    }
    if (item.state === 'added') {
      res[keyPlus] = item.newValue;
    }
    return { ...acc, ...res };
  }, {});
  const comma = /,/g;
  const quote = /"/g;
  const colon = /:/g;
  const leftBrace = /{/;
  const rightBrace = /}/;
  return JSON.stringify(result)
    .replace(leftBrace, '{\n  ')
    .replace(rightBrace, '  \n}')
    .replace(comma, '\n  ')
    .replace(colon, ': ')
    .replace(quote, '');
};

const formatDiff = (diff, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return formatToStylish(diff);
    default:
      throw new Error('Unexpected format');
  }
};

const buildDiff = (filepath1, filepath2) => {
  const path1 = buildFullPath(filepath1);
  const path2 = buildFullPath(filepath2);
  const file1 = readFileSync(path1);
  const format1 = getFormat(filepath1);
  const file2 = readFileSync(path2);
  const format2 = getFormat(filepath2);

  const obj1 = parse(file1, format1);
  const obj2 = parse(file2, format2);

  return compareObjects(obj1, obj2);
};

const genDiff = (filepath1, filepath2) => {
  const diff = buildDiff(filepath1, filepath2);
  const formatted = formatDiff(diff);
  console.log(formatted);
};

export {
  getExtension,
  getFormat,
  parse,
  buildDiff,
};

export default genDiff;
