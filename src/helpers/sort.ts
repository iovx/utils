/**
 * 数组位置交换
 * @param {number[]} arr
 * @param {number} src
 * @param {number} dst
 */
function swap(arr: number[], src: number, dst: number) {
  const temp = arr[src];
  arr[src] = arr[dst];
  arr[dst] = temp;
}

/**
 * 冒泡排序
 * @param arr
 */
export function bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}

/**
 * 选择排序
 * @param arr
 */
export function selectSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      const cur = arr[j];
      if (cur < arr[min]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
  return arr;
}

/**
 * 直接插入排序
 * @param arr
 */
export function insertSort(arr: number[]) {
  let j;
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i];
    for (j = i - 1; j > -1 && arr[j] > temp; j--) {
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = temp;
  }
  return arr;
}

/**
 * 折半插入排序
 * @param arr
 */
export function binaryInsertSort(arr: number[]) {
  let j;
  for (let i = 0; i < arr.length; i++) {
    let low = 0;
    let high = i - 1;
    const temp = arr[i];
    while (low <= high) {
      const m = Math.floor((low + high) / 2);
      if (arr[m] > arr[i]) {
        high = m - 1;
      } else {
        low = m + 1;
      }
    }
    for (j = i - 1; j > high; j--) {
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = temp;
  }
  return arr;
}

function partQuick(arr: number[], left: number, right: number) {
  const m = Math.floor((left + right) / 2);
  let i = left,
    j = right;
  while (i <= j) {
    while (arr[i] < arr[m]) {
      i++;
    }
    while (arr[j] > arr[m]) {
      j--;
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  return i;
}

/**
 * 快速排序
 * @param arr
 * @param left
 * @param right
 */
export function quickSort(arr: number[], left?: number, right?: number) {
  left = left || 0;
  right = right || arr.length - 1;
  const idx = partQuick(arr, left, right);
  if (left < idx - 1) {
    quickSort(arr, left, idx - 1);
  }
  if (right > idx) {
    quickSort(arr, idx, right);
  }
  return arr;
}

function merge(left: number[], right: number[]) {
  const result: number[] = [];
  let idxLeft = 0,
    idxRight = 0;
  while (idxLeft < left.length && idxRight < right.length) {
    if (left[idxLeft] < right[idxRight]) {
      result.push(left[idxLeft++]);
    } else {
      result.push(right[idxRight++]);
    }
  }
  return result.concat(left.slice(idxLeft)).concat(right.slice(idxRight));
}

/**
 * 归并排序
 * @param arr
 * @return {number[]}
 */
export function mergeSort(arr: number[]): number[] {
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  const sep = Math.floor(len / 2);
  const left = arr.slice(0, sep);
  const right = arr.slice(sep);
  return merge(mergeSort(left), mergeSort(right));
}

/**
 * 希尔排序
 * @param arr
 */
export function shellSort(arr: number[]) {
  let gap = Math.floor(arr.length / 2);
  let j, temp;
  while (gap >= 1) {
    for (let i = gap; i < arr.length; i++) {
      temp = arr[i];
      for (j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j];
      }
      arr[j + gap] = temp;
    }
    gap /= 2;
  }
  return arr;
}
