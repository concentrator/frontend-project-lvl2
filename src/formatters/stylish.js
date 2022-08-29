import _ from 'lodash';

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
  const keys = Object.keys(obj).slice().sort();
  return keys.reduce((acc, key, index) => {
    const eol = isLastItem(keys, index) ? `${SYMBOL.lf}${getBraceIndent(depth)}}` : `${SYMBOL.lf}`;
    const value = _.isObject(obj[key]) ? stringifyObject(obj[key], (depth + 1)) : obj[key];
    return `${acc}${getSpaceIndent(depth)}${key}: ${value}${eol}`;
  }, '{\n');
};

const formatValue = (value, depth) => {
  if (_.isObject(value)) {
    return ` ${stringifyObject(value, depth + 1)}`;
  }
  return ` ${value}`;
};

const formatter = (diff) => {
  const iter = (data, depth) => {
    const spaceIndent = getSpaceIndent(depth);
    const braceIndent = getBraceIndent(depth);
    const signIndent = getSignIndent(depth);
    const result = data.reduce((acc, item, index) => {
      const { name, type, children } = item;

      const value = formatValue(item.value, depth);
      const firstValue = formatValue(item.firstValue, depth);
      const secondValue = formatValue(item.secondValue, depth);
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
  return iter(diff.children, 1).trim();
};

export default formatter;
