import {binaryInsertSort, bubbleSort, insertSort, mergeSort, quickSort, selectSort, shellSort} from "../sort";

describe('测试排序函数', () => {
  const result = '1,2,3,4';
  test('冒泡排序', () => {
    expect(bubbleSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('选择排序', () => {
    expect(selectSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('选择排序', () => {
    expect(selectSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('选择排序', () => {
    expect(insertSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('插入排序', () => {
    expect(selectSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('折半插入排序', () => {
    expect(binaryInsertSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('快速排序', () => {
    expect(quickSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('归并排序', () => {
    expect(mergeSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
  test('希尔排序', () => {
    expect(shellSort([4, 2, 1, 3]).join(',')).toBe(result);
  })
})
