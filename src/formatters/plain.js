import _ from 'lodash';

const STRING = {
  prefix: 'Property',
  object: '[complex value]',
};

const formatValue = (value) => {
  if (_.isObject(value)) return `${STRING.object}`;
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const getPostfix = (node) => {
  const {
    type, value, firstValue, secondValue,
  } = node;
  switch (type) {
    case 'added':
      return `was added with value: ${formatValue(value)}`;
    case 'deleted':
      return 'was removed';
    case 'changed':
      return `was updated. From ${formatValue(firstValue)} to ${formatValue(secondValue)}`;
    default:
      throw new Error('Unknown type');
  }
};

const formatter = (diff) => {
  const iter = (node, parents) => {
    const chain = parents ? `${parents}.` : '';
    if (node.type !== 'parent') {
      return (node.type !== 'unchanged') ? `${STRING.prefix} '${parents}' ${getPostfix(node)}` : [];
    }
    return node.children.flatMap((child) => iter(child, `${chain}${child.name}`));
  };
  return iter(diff, '').join('\n');
};

export default formatter;
