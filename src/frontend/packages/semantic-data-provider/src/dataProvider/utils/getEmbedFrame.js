const getEmbedFrame = paths => {
  let embedFrame = {},
    predicates;
  if (paths) {
    for (let path of paths) {
      if (path.includes('/')) {
        predicates = path.split('/').reverse();
      } else {
        predicates = [path];
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
