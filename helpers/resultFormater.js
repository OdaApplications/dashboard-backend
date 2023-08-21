function resultFormater(result) {
  if (result.length === 1) {
    return {
      lables: [Object.keys(result[0])],
      data: [Object.values(result[0])],
    };
  }

  const res = result.reduce(
    (acc, item) => {
      const objValues = Object.values(item);
      acc.lables.push(objValues[0]);
      acc.data.push(objValues[1]);

      return acc;
    },
    {
      lables: [],
      data: [],
    }
  );

  return res;
}

module.exports = { resultFormater };
