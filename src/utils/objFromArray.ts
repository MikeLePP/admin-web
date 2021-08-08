// eslint-disable-next-line @typescript-eslint/ban-types
const objFromArray = (arr: {}[], key = 'id'): {} =>
  arr.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});

export default objFromArray;
