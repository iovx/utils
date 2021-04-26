/* eslint-disable  @typescript-eslint/no-use-before-define */
import {ITreeNode, MapType} from './interface';

/**
 * 复制TREE
 * @param {ITreeNode[]} sourceTreeList
 * @returns {ITreNode[]}
 */
export function copyTreeList(sourceTreeList: ITreeNode[]) {
  return sourceTreeList.map((item) => {
    return transformOutData(item, [], (tItem: ITreeNode, inner: ITreeNode[]) => transformOutItem(tItem, inner));
  });
}

/**
 * DFS遍历 Tree List
 * @param {ITreeNode[]} sourceTreeList
 * @param {(item: ITreeNode, inner: ITreeNode[]) => ITreeNode} callback
 * @returns {any}
 */
export function treeTravel(sourceTreeList: ITreeNode[], callback?: (item: ITreeNode, inner: ITreeNode[]) => ITreeNode) {
  return sourceTreeList.map((item) => {
    return transformOutData(item, [], callback);
  });
}

/**
 * 转换项
 * @param {ITreeNode} item
 * @param {ITreeNode[]} inner
 * @returns {{id: number; pid: number; data: any; children: ITreeNode[]}}
 */
export function transformOutItem(item: ITreeNode, inner: ITreeNode[]) {
  const {id, pid, data} = item;
  return {id, pid, data, children: inner};
}

/**
 * 权限 DFS 遍历
 * @param {ITreeNode} item
 * @param {ITreeNode[]} inner
 * @param {(item: ITreeNode, inner: ITreeNode[]) => ITreeNode} callback
 * @returns {ITreeNode}
 */
export function transformOutData(
  item: ITreeNode,
  inner: ITreeNode[],
  callback?: (item: ITreeNode, inner: ITreeNode[]) => ITreeNode
) {
  const {children} = Object.assign({}, item);
  if (children && children.length) {
    inner = children.map((childItem) => {
      return transformOutData(childItem, inner, callback);
    });
  }
  if (callback) return callback(item, inner);
  return item;
}

/**
 * 获取指定深度的树节点列表
 * @param {ITreeNode[]} treeList
 * @param {number} depth
 * @param {(node: ITreeNode) => ITreeNode} callback
 * @returns {ITreeNode[]}
 */
export function getTreeNodesOfDepth(treeList: ITreeNode[], depth = 0, callback?: (node: ITreeNode) => ITreeNode) {
  const cb = typeof callback === 'function' ? callback : (n: ITreeNode) => n;
  const result: ITreeNode[] = [];
  loop(treeList);
  return result;

  function loop(paramsTreeList: ITreeNode[], curDepth = -1) {
    const nextDepth = ++curDepth;
    paramsTreeList.forEach((node) => {
      if (nextDepth === depth) {
        result.push(cb(node));
      }
      if (node.children && node.children.length) {
        loop(node.children, nextDepth);
      }
    });
  }
}

/**
 * 将树转换为List
 * @param {ITreeNode[]} tree
 * @returns {ITreeNode[]}
 */
export function treeToList(tree: ITreeNode[]) {
  const result: ITreeNode[] = [];
  tree.forEach((item) => {
    getNode(item);
  });
  return result;

  function getNode(item: ITreeNode) {
    const {children} = item;
    if (children && children.length) {
      item.children.forEach((childItem) => {
        getNode(childItem);
      });
    }
    const newNode: ITreeNode = Object.assign({}, item, {children: []});
    result.push(newNode);
  }
}

/**
 * 将树转换为Map
 * @param {ITreeNode[]} tree
 * @param {(node: ITreeNode) => ITreeNode} cb
 * @returns {MapType<ITreeNode>}
 */
export function treeToMap(tree: ITreeNode[], cb?: (node: ITreeNode) => ITreeNode) {
  const list = treeToList(tree);
  const result: MapType<ITreeNode> = {};
  list.forEach((item) => {
    result[item.id] = typeof cb === 'function' ? cb(item) : item;
  });
  return result;
}

/**
 * 将列表转换为指定键的 Map
 * @param {T[]} list
 * @param {string} key
 * @param {(item: T) => U} cb
 * @returns {MapType<U | T>}
 */
export function listToMap<T extends { [index: string]: any } = any, U = any>(
  list: T[],
  key: string,
  cb?: (item: T) => U
) {
  const result: MapType<U | T> = {};
  list.forEach((item) => {
    const itemKey = item[key];
    if (itemKey) {
      result[itemKey] = cb ? cb(item) : item;
    }
  });
  return result;
}

/**
 * 获取指定ID节点
 * @param {ITreeNode[]} treeList
 * @param {number} id
 * @returns {ITreeNode | null}
 */
export function getTreeNode(treeList: ITreeNode[], id: number): ITreeNode | null {
  let result: ITreeNode | null = null;
  for (const node of treeList) {
    if (node.id === id) {
      result = node;
      break;
    }
    if (node.children) {
      result = getTreeNode(node.children, id);
      if (result) {
        break;
      }
    }
  }
  return result;
}

/**
 * 转换成 tree
 * @param {ITreeNode[]} data
 * @param {string} pidKey
 * @param {string} pk
 * @param {(node: ITreeNode) => ITreeNode} callback
 * @param {number} topValue
 * @returns {ITreeNode[]}
 */
export function toTree(
  data: ITreeNode[],
  pidKey = 'pid',
  pk = 'id',
  callback?: (node: ITreeNode) => ITreeNode,
  topValue = -1
) {
  const treeList: ITreeNode[] = [];
  const cb = typeof callback === 'function' ? callback : (n: ITreeNode) => n;
  const group: MapType<ITreeNode[]> = {};
  data.forEach((item) => {
    item.children = [];
    const pid = item[pidKey];
    if (pid === topValue) {
      treeList.push(cb(item));
    } else {
      if (!group[pid]) {
        group[pid] = [];
      }
      group[pid].push(cb(item));
    }
  });
  return c(treeList, group, pk, cb);

  function c(treeList: ITreeNode[], group: MapType<ITreeNode[]>, pk = 'id', cb: (node: ITreeNode) => ITreeNode) {
    for (const node of treeList) {
      const id = node[pk];
      node.children = group[id] || [];
      c(node.children, group, pk, cb);
    }
    return treeList;
  }
}

/**
 * 获取树查找路径（检索项须唯一）
 * @param d 树列表数据
 * @param f 匹配方法 (n)=>boolean
 * @param t 结果转换(n)=>any
 * @returns {*}
 */
export function getTreeNodePath<T extends ITreeNode = ITreeNode>(
  d: T[],
  f: (node: T) => boolean,
  t?: (node: T) => any
) {
  return ((e: boolean | null | number, v: any, r: any[]) =>
    (v = (d: T[]) => (
      d.some((n) =>
        n.children && n.children.length
          ? !!(v(n.children), e ? r.push(t ? t(n) : n) : false)
          : !!(f(n) ? (e = r.push(t ? t(n) : n)) : false)
      ),
      r
    ))(d))(false, null, []);
}

/**
 * 检索树过滤为子树
 * @param data 搜索关键字
 * @param filter 搜索过滤实现
 */
export function searchTree(data: ITreeNode[], filter: (key: ITreeNode) => boolean) {
  const result: ITreeNode[] = [];
  data.forEach((item) => {
    result.push(loop(item, [] as ITreeNode[], filter));
  });
  return result.filter(filter);

  function loop(item: ITreeNode, inner: ITreeNode[], filter: (key: ITreeNode) => boolean) {
    const {children} = Object.assign({}, item);
    if (children && children.length) {
      inner = children.map((item) => loop(item, inner, filter)).filter(filter);
    }
    const {children: ic, ...rest} = item;
    return {...rest, children: inner};
  }
}

/**
 * Tree转换为List
 * @param data
 * @param output
 */
export function flatTree(data: ITreeNode[], output: ITreeNode[] = []) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    output.push(node);
    if (node.children) {
      flatTree(node.children, output);
    }
  }
  return output;
}

/**
 * 检索子树
 * @param {ITreeNode[]} treeList
 * @param {(n: ITreeNode) => boolean} filter
 * @returns {(ITreeNode | null)[]}
 */
export function getSearchTree(treeList: ITreeNode[], filter: (n: ITreeNode) => boolean) {
  function loop(node: ITreeNode) {
    if (filter(node)) {
      return node;
    }
    if (node.children) {
      node.children = node.children.map(loop).filter(Boolean) as ITreeNode[];
      if (node.children.length) {
        return node;
      }
    }
    return null;
  }

  return treeList.map(loop).filter(Boolean);
}

/**
 * 排序树
 * @param tree
 * @param compareCallback
 */
export function treeSort(tree: ITreeNode[], compareCallback: (a: ITreeNode, b: ITreeNode) => number) {
  tree.sort(compareCallback);
  for (const node of tree) {
    if (node.children && node.children.length) {
      treeSort(node.children, compareCallback);
    }
  }
  return tree;
}
