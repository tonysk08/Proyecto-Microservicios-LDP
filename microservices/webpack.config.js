const path = require('path');

/**
 * Config webpack para los builds de las apps NestJS (monorepo).
 *
 * Resuelve los alias `@app/*` de las librerías compartidas vía `resolve.alias`,
 * en lugar de depender de `tsconfig-paths-webpack-plugin` (que requiere `baseUrl`,
 * opción deprecada en TS 7.0). El type-check lo sigue haciendo ts-loader con los
 * `paths` relativos del tsconfig.
 */
module.exports = (options) => ({
  ...options,
  resolve: {
    ...(options.resolve || {}),
    alias: {
      ...((options.resolve && options.resolve.alias) || {}),
      '@app/shared-contracts': path.resolve(
        __dirname,
        'libs/shared-contracts/src',
      ),
      '@app/common': path.resolve(__dirname, 'libs/common/src'),
    },
  },
});
