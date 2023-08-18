function resultFormater(result) {
  const res = result.reduce(
    (acc, item) => {
      console.log(Object.values(item));
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
