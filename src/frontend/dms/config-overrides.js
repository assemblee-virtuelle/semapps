const { override, babelInclude } = require('customize-cra')
const path = require('path')

// Also transpile the react-admin package
// https://github.com/facebook/create-react-app/issues/1333#issuecomment-593667643
// https://github.com/anthanh/lerna-react-ts-transpile-modules
module.exports = override(
  babelInclude([
    path.resolve('src'),
    path.resolve('../packages/react-admin'),
  ]),
);
