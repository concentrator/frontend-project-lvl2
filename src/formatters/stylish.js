import _ from 'lodash';

const indentSize = 2;

const getSpaceIndent = (depth) => '  '.repeat(depth * indentSize);
const getBraceIndent = (depth) => '  '.repeat(depth * indentSize - indentSize);
const getSignIndent = (depth) => '  '.repeat(depth * indentSize - (indentSize - 1));

const stringify = (value, depth) => {
  if (!_.isObject(value)) return `${value}`;

  const lines = Object.entries(value)
    .map(([key, val]) => `${getSpaceIndent(depth + 1)}${key}: ${stringify(val, (depth + 1))}`);
  return ['{', ...lines, `${getBraceIndent(depth + 1)}}`].join('\n');
};

const formatter = (diff) => {
  const iter = (data, depth) => {
    const spaceIndent = getSpaceIndent(depth);
    const braceIndent = getBraceIndent(depth + 1);
    const signIndent = getSignIndent(depth);
    const { name, type, children } = data;
    const mapping = {
      root: () => `{\n${children.flatMap((child) => iter(child, (depth))).join('\n')}\n}`,
      parent: () => {
        const childrenStr = `${children.flatMap((child) => iter(child, (depth + 1))).join('\n')}`;
        return `${spaceIndent}${name}: {\n${childrenStr}\n${braceIndent}}`;
      },
      added: () => `${signIndent}+ ${name}: ${stringify(data.value, depth)}`,
      deleted: () => `${signIndent}- ${name}: ${stringify(data.value, depth)}`,
      changed: () => {
        const oldValueStr = `${signIndent}- ${name}: ${stringify(data.firstValue, depth)}`;
        const newValueStr = `${signIndent}+ ${name}: ${stringify(data.secondValue, depth)}`;
        return `${oldValueStr}\n${newValueStr}`;
      },
      unchanged: () => `${spaceIndent}${name}: ${stringify(data.value, depth)}`,
    };
    return mapping[type]();
  };
  return iter(diff, 1);
};

export default formatter;
