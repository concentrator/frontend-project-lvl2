import { readFileSync } from 'node:fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

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
  return keys.map(compareProp);
};

const SYMBOL = {
  space: '  ',
  minus: '- ',
  plus: '+ ',
  lf: '\n',
};

const indentSize = 2;

const getSpaceIndent = (depth) => SYMBOL.space.repeat(depth * indentSize);
const getBraceIndent = (depth) => SYMBOL.space.repeat(depth * indentSize - indentSize);
const getSignIndent = (depth) => SYMBOL.space.repeat(depth * indentSize - (indentSize - 1));
const isLastItem = (arr, currentIndex) => currentIndex === arr.length - 1;

const stringifyObject = (obj, depth = 1) => {
  const keys = Object.keys(obj).sort();
  return keys.reduce((acc, key, index) => {
    const eol = isLastItem(keys, index) ? `${SYMBOL.lf}${getBraceIndent(depth)}}` : `${SYMBOL.lf}`;
    const value = _.isObject(obj[key]) ? stringifyObject(obj[key], (depth + 1)) : obj[key];
    return `${acc}${getSpaceIndent(depth)}${key}: ${value}${eol}`;
  }, '{\n');
};

const formatValue = (value, depth) => {
  if (value === '') return '';
  return (_.isObject(value)) ? ` ${stringifyObject(value, depth)}` : ` ${value}`;
};

const formatToStylish = (diff) => {
  const iter = (data, depth) => {
    const spaceIndent = getSpaceIndent(depth);
    const braceIndent = getBraceIndent(depth);
    const signIndent = getSignIndent(depth);

    const result = data.reduce((acc, item, index) => {
      const { name, type, children } = item;
      const value = formatValue(item.value, (depth + 1));
      const firstValue = formatValue(item.firstValue, (depth + 1));
      const secondValue = formatValue(item.secondValue, (depth + 1));
      const eol = isLastItem(data, index) ? `${SYMBOL.lf}${braceIndent}}` : `${SYMBOL.lf}`;

      if (type === 'parent') {
        return `${acc}${spaceIndent}${name}:${iter(children, (depth + 1))}${eol}`;
      }
      if (type === 'unchanged') {
        return `${acc}${spaceIndent}${name}:${value}${eol}`;
      }
      if (type === 'changed') {
        return `${acc}${signIndent}${SYMBOL.minus}${name}:${firstValue}${SYMBOL.lf}${signIndent}${SYMBOL.plus}${name}:${secondValue}${eol}`;
      }
      if (type === 'deleted') {
        return `${acc}${signIndent}${SYMBOL.minus}${name}:${value}${eol}`;
      }
      if (type === 'added') {
        return `${acc}${signIndent}${SYMBOL.plus}${name}:${value}${eol}`;
      }
      throw new Error('Unknown type');
    }, ' {\n');
    return result;
  };
  return iter(diff, 1).trim();
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
