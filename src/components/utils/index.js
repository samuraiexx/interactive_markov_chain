
export function multiplyMatrix(a, b) {
  if (a[0].length !== b.length) {
    throw Error("Algo de errado nao esta certo");
  }

  const result = Array(a.length)
    .fill([])
    .map(() => Array(b[0].length).fill(0));

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      for (let k = 0; k < a.length; k++) {
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

  console.log(result);
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

export function gauss(M, y) {
  M.forEach((line, i) => line.push(y[i]));

  for (let i = 0; i < M.length; i++) {
    for (let j = i + 1; j < M.length; j++) {
      if (M[i][i] < M[j][i]) {
        [M[i], M[j]] = [M[j], M[i]]; // Swap
      }
    }

    if (!M[i][i]) {
      return null;
    }

    const x = M[i][i];
    M[i] = M[i].map(el => el / x);

    for (let k = i + 1; k < M.length; k++) {
      const x = M[k][i];
      for (let j = 0; j < M[0].length; j++) {
        M[k][j] -= x * M[i][j];
      }
    }
  }

  for (let i = M.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      const x = M[j][i];
      for (let k = i; k < M[0].length; k++) {
        M[j][k] -= x * M[i][k];
      }
    }
  }

  return M.map(line => line[line.length - 1]);
}