/**
 * 将平铺的列表数据遍历为树形数据
 */
export function getTree(
  data: unknown[],
  option: {
    root?: number;
    id?: string;
    pid?: string;
    children?: string;
    cloneSource?: boolean;
  } = {}
) {
  const options = Object.assign(
    {
      root: 0,
      id: "id",
      pid: "pid",
      children: "children",
      cloneSource: false,
    },
    option
  );

  // 创建一个新的数据, 避免污染外界的参数
  const { root, id, pid, children, cloneSource } = options;
  const source = cloneSource ? JSON.parse(JSON.stringify(data)) : data;
  const dataMap = {};
  const res = [];

  for (let item of source) {
    const itemId = item[id];
    const itemPid = item[pid];

    if (!dataMap[itemId]) {
      // => {[item.id]: item}
      dataMap[itemId] = item;
    }

    if (itemPid === root) {
      // 顶级类
      res.push(item);
      continue;
    }

    // --- 处理非顶级类
    if (!dataMap[itemPid]) {
      // 没有顶级类的二级类(一般是脏数据)
      dataMap[itemPid] = {};
    }

    if (!dataMap[itemPid][children]) {
      dataMap[itemPid][children] = [];
    }

    dataMap[itemPid][children].push(item);
  }

  return res;
}
