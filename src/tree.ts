import { makeAutoObservable, observable, toJS } from "mobx";
import { TreeItem } from "react-complex-tree";

class TreeStore {
  root = [
    {
      id: "1",
      type: "transforms.translate",
      params: [[1, 0, 0]],
      children: [
        {
          id: "2",
          type: "booleans.subtract",
          children: [
            {
              id: "3",
              type: "primitives.cuboid",
              size: [1, 1, 1],
            },
            {
              id: "4",
              type: "primitives.cylinder",
              height: 2,
              radius: 0.5,
            },
            {
              id: "5",
              type: "transforms.translate",
              params: [[0, 0, 0.25]],
              children: [
                {
                  id: "6",
                  type: "transforms.rotate",
                  params: [[Math.PI / 2, 0, 0]],
                  children: [
                    {
                      id: "7",
                      type: "primitives.cylinder",
                      height: 2,
                      radius: 0.25,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  asComplexTree(root: any): Record<string, TreeItem> {
    let complexTree: Record<string, TreeItem> = {};

    for (const n of root) {
      complexTree[n.id] = {
        index: n.id,
        data: `[${n.id}] ${n.type}`,
        children: n.children?.map((child: any) => child.id) || [],
      };
      const children = this.asComplexTree(n.children || []);

      complexTree = { ...complexTree, ...children };
    }

    return complexTree;
  }
}

export const treeStore = new TreeStore();
