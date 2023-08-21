function resultFormater(result) {
  if (result.length === 1) {
    return {
      labels: Object.keys(result[0]),
      data: Object.values(result[0]),
    };
  }

  const res = result.reduce(
    (acc, item) => {
      const objValues = Object.values(item);
      acc.labels.push(objValues[0]);
      acc.data.push(objValues[1]);

      return acc;
    },
    {
      labels: [],
      data: [],
    }
  );

  return res;
}

module.exports = { resultFormater };
