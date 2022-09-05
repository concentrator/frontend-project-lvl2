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
  const added = () => `was added with value: ${formatValue(value)}`;
  const deleted = () => 'was removed';
  const changed = () => `was updated. From ${formatValue(firstValue)} to ${formatValue(secondValue)}`;
  const mapping = { added, deleted, changed };
  return mapping[type]();
};

const formatter = (diff) => {
  const iter = (node, chain) => {
    const parents = chain ? `${chain}.` : '';
    if (node.type !== 'parent') {
      return (node.type !== 'unchanged') ? `${STRING.prefix} '${chain}' ${getPostfix(node)}` : [];
    }
    return node.children.flatMap((child) => iter(child, `${parents}${child.name}`));
  };
  return iter(diff, '').join('\n');
};

export default formatter;
