import stylish from './stylish.js';
import plain from './plain.js';

const formatDiff = (diff, format) => {
  switch (format) {
    case 'stylish':
      return stylish(diff);
    case 'plain':
      return plain(diff);
    default:
      throw new Error('Unexpected format');
  }
};

export default formatDiff;
