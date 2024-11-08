export const stateDiff = (obj1: any, obj2: any): any => {
  return Object.keys(obj1).reduce((result, key) => {
    if (obj1[key] !== obj2[key]) {
      result[key] = obj2[key];
    }
    return result;
  }, {} as any);
};

export const deepDiff = (oldObj: any, newObj: any): any => {
  if (oldObj === newObj) return undefined;
  if (oldObj == null || newObj == null) return newObj;
  if (typeof oldObj !== 'object' || typeof newObj !== 'object') return newObj;

  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    const diff: any[] = [];
    const maxLength = Math.max(oldObj.length, newObj.length);
    let hasDiff = false;

    for (let i = 0; i < maxLength; i++) {
      if (i >= oldObj.length) {
        diff[i] = newObj[i];
        hasDiff = true;
      } else if (i >= newObj.length) {
        diff[i] = undefined;
        hasDiff = true;
      } else {
        const elementDiff = deepDiff(oldObj[i], newObj[i]);
        if (elementDiff !== undefined) {
          diff[i] = elementDiff;
          hasDiff = true;
        }
      }
    }

    return hasDiff ? diff : undefined;
  }

  const diff: any = {};
  let hasDiff = false;

  for (const key in newObj) {
    if (!(key in oldObj)) {
      diff[key] = newObj[key];
      hasDiff = true;
    } else {
      const result = deepDiff(oldObj[key], newObj[key]);
      if (result !== undefined) {
        diff[key] = result;
        hasDiff = true;
      }
    }
  }

  for (const key in oldObj) {
    if (!(key in newObj)) {
      diff[key] = undefined;
      hasDiff = true;
    }
  }

  return hasDiff ? diff : undefined;
};
