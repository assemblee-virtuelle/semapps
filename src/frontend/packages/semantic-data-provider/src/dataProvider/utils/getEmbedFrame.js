const getEmbedFrame = blankNodes => {
  let embedFrame = {},
    predicates;
  if (blankNodes) {
    for (let blankNode of blankNodes) {
      if (blankNode.includes('/')) {
        predicates = blankNode.split('/').reverse();
      } else {
        predicates = [blankNode];
      }
      embedFrame = {
        ...embedFrame,
        ...predicates.reduce(
          (accumulator, predicate) => ({
            [predicate]: {
              '@embed': '@last',
              ...accumulator
            }
          }),
          {}
        )
      };
    }
    return embedFrame;
  }
};

export default getEmbedFrame;
