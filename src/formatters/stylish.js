import _ from 'lodash';

const space = '  ';
const minus = '- ';
const plus = '+ ';
const lf = '\n';

const indentSize = 2;

const getSpaceIndent = (depth) => space.repeat(depth * indentSize);
const getBraceIndent = (depth) => space.repeat(depth * indentSize - indentSize);
const getSignIndent = (depth) => space.repeat(depth * indentSize - (indentSize - 1));
const isLastItem = (arr, currentIndex) => currentIndex === arr.length - 1;

const stringifyObject = (obj, depth = 1) => {
  const keys = _.sortBy(Object.keys(obj));
  return keys.reduce((acc, key, index) => {
    const eol = isLastItem(keys, index) ? `${lf}${getBraceIndent(depth)}}` : `${lf}`;
    const value = _.isObject(obj[key]) ? stringifyObject(obj[key], (depth + 1)) : obj[key];
    return `${acc}${getSpaceIndent(depth)}${key}: ${value}${eol}`;
  }, '{\n');
};

const stringify = (value, depth) => {
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
      const eol = isLastItem(data, index) ? `${lf}${braceIndent}}` : `${lf}`;
      const mapping = {
        parent: () => `${acc}${spaceIndent}${name}:${iter(children, (depth + 1))}${eol}`,
        added: () => `${acc}${signIndent}${plus}${name}:${stringify(item.value, depth)}${eol}`,
        deleted: () => `${acc}${signIndent}${minus}${name}:${stringify(item.value, depth)}${eol}`,
        changed: () => {
          const oldValueStr = `${signIndent}${minus}${name}:${stringify(item.firstValue, depth)}`;
          const newValueStr = `${signIndent}${plus}${name}:${stringify(item.secondValue, depth)}`;
          return `${acc}${oldValueStr}${lf}${newValueStr}${eol}`;
        },
        unchanged: () => `${acc}${spaceIndent}${name}:${stringify(item.value, depth)}${eol}`,
      };

      return mapping[type]();
    }, ' {\n');
    return result;
  };
  return iter(diff.children, 1).trim();
};

export default formatter;
