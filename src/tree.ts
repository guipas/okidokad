import { observable } from "mobx";

export const tree = observable({
  root: [
    {
      type: "transforms.translate",
      params: [[1, 0, 0]],
      children: [
        {
          type: "booleans.subtract",
          children: [
            {
              type: "primitives.cuboid",
              size: [1, 1, 1],
            },
            {
              type: "primitives.cylinder",
              height: 2,
              radius: 0.5,
            },
            {
              type: "transforms.translate",
              params: [[0, 0, 0.25]],
              children: [
                {
                  type: "transforms.rotate",
                  params: [[Math.PI / 2, 0, 0]],
                  children: [
                    {
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
  ],
});
