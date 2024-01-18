function extractKey(path: string) {
  return path.split('/')[1];
}

const widgetsModules = require.context("src/extensions/widgets", true, /index\.ts$/)
export const widgets: { [key: string]: any } = Object.fromEntries(
  widgetsModules.keys().map(key => [
    extractKey(key),
    widgetsModules(key).default
  ])
);

const categoriesModules = require.context("src/extensions/categories", true, /index\.ts$/)
export const categories: { [key: string]: any } = Object.fromEntries(
  categoriesModules.keys().map(key => [
    extractKey(key),
    categoriesModules(key).default
  ])
);
