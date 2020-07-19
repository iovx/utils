import { copyTreeList, getTreeNode, getTreeNodesOfDepth, listToMap, toTree, treeToMap, treeTravel } from '../tree';


describe('测试Tree相关', () => {
  const data = [
    {
      id: 1,
      pid: -1,
      children: [],
      data: {
        name: 'Front End',
      },
    },
    {
      id: 2,
      pid: -1,
      children: [],
      data: {
        name: 'Server End',
      },
    },
    {
      id: 3,
      pid: 2,
      children: [],
      data: {
        name: 'PHP',
      },
    },
    {
      id: 4,
      pid: 2,
      children: [],
      data: {
        name: 'Java',
      },
    },
  ];
  const tree = [
    {
      id: 1,
      pid: -1,
      children: [],
      data: {
        name: 'Front End',
      },
    },
    {
      id: 2,
      pid: -1,
      children: [
        {
          id: 3,
          pid: 2,
          children: [],
          data: {
            name: 'PHP',
          },
        },
        {
          id: 4,
          pid: 2,
          children: [],
          data: {
            name: 'Java',
          },
        },
      ],
      data: {
        name: 'Server End',
      },
    },
  ];
  // beforeAll(() => {
  //   console.log('START TEST TREE....');
  // });
  // afterAll(() => {
  //   console.log('STOP TEST TREE....');
  // });
  test('测试Tree组装', () => {
    const result = toTree(data);
    const expected = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [
          {
            id: 3,
            pid: 2,
            children: [],
            data: {
              name: 'PHP',
            },
          },
          {
            id: 4,
            pid: 2,
            children: [],
            data: {
              name: 'Java',
            },
          },
        ],
        data: {
          name: 'Server End',
        },
      },
    ];
    expect(result).toEqual(expected);
    const result2 = toTree(data, 'pid', 'id', node => {
      delete node.data;
      return node;
    });
    const expected2 = [
      {
        id: 1,
        pid: -1,
        children: [],
      },
      {
        id: 2,
        pid: -1,
        children: [
          {
            id: 3,
            pid: 2,
            children: [],
          },
          {
            id: 4,
            pid: 2,
            children: [],
          },
        ],
      },
    ];
    expect(result2).toEqual(expected2);
  });
  test('复制Tree', () => {
    expect(copyTreeList(data)).toEqual(data);
  });
  test('获取指定深度', () => {
    const data = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [
          {
            id: 3,
            pid: 2,
            children: [],
            data: {
              name: 'PHP',
            },
          },
          {
            id: 4,
            pid: 2,
            children: [],
            data: {
              name: 'Java',
            },
          },
        ],
        data: {
          name: 'Server End',
        },
      },
    ];
    const expected = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [],
        data: {
          name: 'Server End',
        },
      },
    ];
    const result = getTreeNodesOfDepth(data, 0, (node) => {
      const newNode = { ...node };
      newNode.children = [];
      return newNode;
    });
    expect(result).toEqual(expected);
    const result2 = getTreeNodesOfDepth(data, 1);
    const expected2 = [
      {
        id: 3,
        pid: 2,
        children: [],
        data: {
          name: 'PHP',
        },
      },
      {
        id: 4,
        pid: 2,
        children: [],
        data: {
          name: 'Java',
        },
      },
    ];
    expect(result2).toEqual(expected2);
  });
  test('DFS树遍历', () => {
    expect(treeTravel(tree)).toEqual(tree);
  });
  test('Tree转换Map', () => {
    const data = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [
          {
            id: 3,
            pid: 2,
            children: [],
            data: {
              name: 'PHP',
            },
          },
          {
            id: 4,
            pid: 2,
            children: [],
            data: {
              name: 'Java',
            },
          },
        ],
        data: {
          name: 'Server End',
        },
      },
    ];
    const expected = {
      1: {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      2: {
        id: 2,
        pid: -1,
        children: [],
        data: {
          name: 'Server End',
        },
      },
      3: {
        id: 3,
        pid: 2,
        children: [],
        data: {
          name: 'PHP',
        },
      },
      4: {
        id: 4,
        pid: 2,
        children: [],
        data: {
          name: 'Java',
        },
      },
    };
    const expected2 = {
      1: {
        id: 1,
        pid: -1,
        children: [],
      },
      2: {
        id: 2,
        pid: -1,
        children: [],
      },
      3: {
        id: 3,
        pid: 2,
        children: [],
      },
      4: {
        id: 4,
        pid: 2,
        children: [],
      },
    };
    expect(treeToMap(data)).toEqual(expected);
    expect(treeToMap(data, node => {
      delete node.data;
      return node;
    })).toEqual(expected2);
  });
  test('Tree节点查找', () => {
    expect(getTreeNode(tree, 1)).toEqual(tree[0]);
    expect(getTreeNode(tree, 2)).toEqual(tree[1]);
    expect(getTreeNode(tree, 3)).toEqual(tree[1].children[0]);
    const tree2 = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [
          {
            id: 3,
            pid: 2,
            children: null,
            data: {
              name: 'PHP',
            },
          },
          {
            id: 4,
            pid: 2,
            children: [],
            data: {
              name: 'Java',
            },
          },
        ],
        data: {
          name: 'Server End',
        },
      },
    ];
    expect(getTreeNode(tree2 as any, 3)).toEqual(tree2[1].children[0]);
  });
  test('List转换Map', () => {
    const data = [
      {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      {
        id: 2,
        pid: -1,
        children: [],
        data: {
          name: 'Server End',
        },
      },
      {
        id: 3,
        pid: 2,
        children: [],
        data: {
          name: 'PHP',
        },
      },
      {
        id: 4,
        pid: 2,
        children: [],
        data: {
          name: 'Java',
        },
      },
    ];
    const expected = {
      1: {
        id: 1,
        pid: -1,
        children: [],
        data: {
          name: 'Front End',
        },
      },
      2: {
        id: 2,
        pid: -1,
        children: [],
        data: {
          name: 'Server End',
        },
      },
      3: {
        id: 3,
        pid: 2,
        children: [],
        data: {
          name: 'PHP',
        },
      },
      4: {
        id: 4,
        pid: 2,
        children: [],
        data: {
          name: 'Java',
        },
      },
    };
    expect(listToMap(data, 'id')).toEqual(expected);
    const expected2 = {
      1: 'Front End',
      2: 'Server End',
      3: 'PHP',
      4: 'Java',
    };
    expect(listToMap(data, 'id', item => item.data.name)).toEqual(expected2);
    expect(listToMap(data, 'nullKey', item => item.data.name)).toEqual({});
  });
});
