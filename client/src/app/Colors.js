// @flow

export default class Colors {
  static index = -1;

  static colors = [
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

  /**
   * Get the next color
   * @return {string} The next color
   */
  static next(): string {
    return Colors.colors[++Colors.index % Colors.colors.length];
  }
}
