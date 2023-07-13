const getEmbedFrame = blankNodes => {
  let embedFrame = {};
  let predicates;
  if (blankNodes) {
    for (const blankNode of blankNodes) {
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
