import { readFileSync } from 'node:fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers.js';
import formatDiff from './formatters/index.js';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

const extractFormat = (filepath) => path.extname(filepath).slice(1);

const compareObjects = (obj1, obj2) => {
  const iter = (data1, data2) => {
    const compareProp = (key) => {
      const firstValue = data1[key];
      const secondValue = data2[key];
      if (_.isObject(firstValue) && _.isObject(secondValue)) {
        return {
          name: key,
          type: 'parent',
          children: iter(firstValue, secondValue),
        };
      }
      if (!_.has(data1, key)) {
        return {
          name: key,
          type: 'added',
          value: secondValue,
        };
      }
      if (!_.has(data2, key)) {
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
    const keys = _.sortBy(Object.keys({ ...data1, ...data2 }));
    return keys.map(compareProp);
  };
  const children = iter(obj1, obj2);
  return {
    type: 'root',
    children: [...children],
  };
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const parsedFileData1 = parse(readFileSync(buildFullPath(filepath1)), extractFormat(filepath1));
  const parsedFileData2 = parse(readFileSync(buildFullPath(filepath2)), extractFormat(filepath2));
  const diff = compareObjects(parsedFileData1, parsedFileData2);
  return formatDiff(diff, format);
};

export default genDiff;
