export const getUserId = uri => {
  const matches = uri.match(/schema:Person\/(.*)/);
  return matches[1];
};
