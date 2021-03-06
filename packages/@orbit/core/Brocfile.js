'use strict';

const build = require('@glimmer/build');
const packageDist = require('@glimmer/build/lib/package-dist');

let buildOptions = {
  external: ['@orbit/utils']
};

if (process.env.BROCCOLI_ENV === 'tests') {
  buildOptions.vendorTrees = [packageDist('@orbit/utils', { lang: 'es2017' })];
  buildOptions.test = { es5: false };
}

module.exports = build(buildOptions);
