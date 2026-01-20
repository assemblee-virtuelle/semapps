const getEmbedFrame = (blankNodes: any) => {
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
          // @ts-expect-error TS(7006): Parameter 'accumulator' implicitly has an 'any' ty... Remove this comment to see the full error message
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
