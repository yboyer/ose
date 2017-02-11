// @flow

export default {
  index: -1,

  next(): string {
    return this.colors[++this.index % this.colors.length];
  },

  colors: [
    'red',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'orange'
  ]
};
