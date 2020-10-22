export const EPS = 1e-6;
export const INF = 1e6;

export function multiplyMatrixVec(a, x) {
  const b = x.map(y => [y]);
  return multiplyMatrix(a, b).map(x => x[0]);
}

export function multiplyMatrix(a, b) {
  if (a[0].length !== b.length) {
    throw Error("Algo de errado nao esta certo");
  }

  const result = Array(a.length)
    .fill([])
    .map(() => Array(b[0].length).fill(0));

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

export function matrixExp(a, b) {
  if (a.length === 0 || a.length !== a[0].length) {
    throw Error("Algo de errado nao esta certo, so q na exponencial");
  }

  const length = a.length;
  let result = Array(length)
    .fill([])
    .map(() => Array(length).fill(0));

  for (let i = 0; i < length; i++) {
    result[i][i] = 1;
  }

  while (b > 0) {
    if (b % 2 === 0) {
      a = multiplyMatrix(a, a);
      b /= 2;
      continue;
    }
    result = multiplyMatrix(result, a);
    b--;
  }

  return result;
}

export function transpose(a) {
  if (a.length === 0) {
    return;
  }

  const result = Array(a[0].length)
    .fill([])
    .map(() => Array(a.length).fill(0));

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[0].length; j++) {
      result[j][i] = a[i][j];
    }
  }

  return result;
}

export function equal(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] + EPS < b[i] || a[i] - EPS > b[i]) {
      return false;
    }
  }

  return true;
}
