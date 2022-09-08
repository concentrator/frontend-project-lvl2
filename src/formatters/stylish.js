import _ from 'lodash';

const space = '  ';
const minus = '- ';
const plus = '+ ';
const openBrace = '{';
const closeBrace = '}';
const colon = ': ';
const lf = '\n';

const indentSize = 2;

const getSpaceIndent = (depth) => space.repeat(depth * indentSize);
const getBraceIndent = (depth) => space.repeat(depth * indentSize - indentSize);
const getSignIndent = (depth) => space.repeat(depth * indentSize - (indentSize - 1));

const stringify = (value, depth) => {
  if (_.isObject(value)) {
    const lines = Object.entries(value)
      .map(([key, val]) => `${getSpaceIndent(depth + 1)}${key}${colon}${stringify(val, (depth + 1))}`);
    return [`${openBrace}`, ...lines, `${getBraceIndent(depth + 1)}${closeBrace}`].join(lf);
  }
  return `${value}`;
};

const formatter = (diff) => {
  const iter = (data, depth) => {
    const spaceIndent = getSpaceIndent(depth);
    const braceIndent = getBraceIndent(depth + 1);
    const signIndent = getSignIndent(depth);
    const { name, type, children } = data;
    const mapping = {
      root: () => `${openBrace}${lf}${children.flatMap((child) => iter(child, (depth))).join(lf)}${lf}${closeBrace}`,
      parent: () => {
        const childrenStr = `${children.flatMap((child) => iter(child, (depth + 1))).join(lf)}`;
        return `${spaceIndent}${name}${colon}${openBrace}${lf}${childrenStr}${lf}${braceIndent}${closeBrace}`;
      },
      added: () => `${signIndent}${plus}${name}${colon}${stringify(data.value, depth)}`,
      deleted: () => `${signIndent}${minus}${name}${colon}${stringify(data.value, depth)}`,
      changed: () => {
        const oldValueStr = `${signIndent}${minus}${name}${colon}${stringify(data.firstValue, depth)}`;
        const newValueStr = `${signIndent}${plus}${name}${colon}${stringify(data.secondValue, depth)}`;
        return `${oldValueStr}${lf}${newValueStr}`;
      },
      unchanged: () => `${spaceIndent}${name}${colon}${stringify(data.value, depth)}`,
    };
    return mapping[type]();
  };
  return iter(diff, 1);
};

export default formatter;
