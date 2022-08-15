import { readFileSync } from 'node:fs';
import path from 'path';
// import _ from 'lodash';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

const getExtension = (filename) => {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
};

const getFileFormat = (filepath) => {
  const filename = path.basename(filepath).toLowerCase();
  const format = getExtension(filename);
  return format;
};

const parseFile = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    default:
      throw new Error('Unexpected format');
  }
};

const compareProp = (key, obj1, obj2) => {
  const oldValue = obj1[key];
  const newValue = obj2[key];
  if (!Object.hasOwn(obj1, key)) {
    return {
      key, oldValue, newValue, state: 'added',
    };
  }
  if (!Object.hasOwn(obj2, key)) {
    return {
      key, oldValue, newValue, state: 'deleted',
    };
  }
  if (oldValue !== newValue) {
    return {
      key, oldValue, newValue, state: 'changed',
    };
  }
  return {
    key, oldValue, newValue, state: 'unchanged',
  };
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
  const comma = /,/gi;
  const quote = /"/gi;
  const colon = /:/gi;
  const leftBrace = /{/i;
  const rightBrace = /}/i;
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

const genDiff = (filepath1, filepath2) => {
  const path1 = buildFullPath(filepath1);
  const path2 = buildFullPath(filepath2);
  const file1 = readFileSync(path1);
  const format1 = getFileFormat(filepath1);
  const file2 = readFileSync(path2);
  const format2 = getFileFormat(filepath2);

  const obj1 = parseFile(file1, format1);
  const obj2 = parseFile(file2, format2);

  const diff = compareObjects(obj1, obj2);
  console.log(formatDiff(diff));
};

export default genDiff;
