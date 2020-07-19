export type MapType<T> = { [index: string]: T };

export interface ITreeNode {
  id: number;
  pid: number;
  data?: any;
  children: ITreeNode[];

  [index: string]: any;
}
