
export const memoize = func => {
  let memoCache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (key in memoCache) {
      console.log(`==${key} Found in memo cache:`, memoCache);
      return memoCache[key];
    } else {
      memoCache[key] = func(...args);
    }
  }
}