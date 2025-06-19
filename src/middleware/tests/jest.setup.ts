// @ts-expect-error TS(2304): Cannot find name 'expect'.
expect.extend({
  // An assertion to check if a value is undefined or an empty array
  toBeUndefinedOrEmptyArray(received: any) {
    const pass = received === undefined || (Array.isArray(received) && received.length === 0);
    if (pass) {
      return {
        message: () => `expected ${received} not to be undefined or an empty array`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be undefined or an empty array`,
        pass: false
      };
    }
  }
});
