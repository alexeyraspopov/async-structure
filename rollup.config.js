import babel from 'rollup-plugin-babel';
import entries from 'rollup-plugin-multi-entry';

let plugins = [
  entries(),
  babel({
    babelrc: false,
    presets: [['env', { modules: false, loose: true }]],
    plugins: ['external-helpers'],
  }),
];

export default [
  {
    input: 'modules/*.js',
    output: {
      file: 'build/async-structure.js',
      format: 'cjs',
    },
    plugins,
  },
  {
    input: 'modules/*.js',
    output: {
      file: 'build/async-structure.module.js',
      format: 'es',
    },
    plugins,
  },
];
