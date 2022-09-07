import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return String(value);
};

const formatter = (diff) => {
  const iter = (node, propertyPath) => {
    const {
      type, value, firstValue, secondValue, children,
    } = node;
    const mapping = {
      root: () => children.flatMap((child) => iter(child, `${child.name}`)),
      parent: () => children.flatMap((child) => iter(child, `${propertyPath}.${child.name}`)),
      added: () => `Property '${propertyPath}' was added with value: ${stringify(value)}`,
      deleted: () => `Property '${propertyPath}' was removed`,
      changed: () => `Property '${propertyPath}' was updated. From ${stringify(firstValue)} to ${stringify(secondValue)}`,
      unchanged: () => [],
    };
    return mapping[type]();
  };
  return iter(diff, '').join('\n');
};

export default formatter;
