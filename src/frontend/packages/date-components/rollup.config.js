import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import css from "rollup-plugin-import-css";
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';
import { createFilter } from 'rollup-pluginutils';

const external = createFilter(
  [
    'react',
    'react-admin',
    'react-markdown',
    'react-router-dom',
    'react-final-form',
    'react-router',
    'react-redux',
    '@material-ui/**'
  ],
  null,
  { resolve: false }
);

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: './dist/index.cjs.js', sourcemap: false },
    { format: 'es', file: './dist/index.es.js', sourcemap: false }
  ],
  external,
  plugins: [
    json(),
    replace({
      // Make sure React code is compiled in production mode
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    // Resolve but don't compile the node_modules directory
    nodeResolve(),
    commonjs(),
    css(),
    // Minify the result
    terser()
  ]
};
