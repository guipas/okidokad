import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { booleans, colors, primitives } from "@jscad/modeling";
import * as jscadModeling from "@jscad/modeling";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, useHelper } from "@react-three/drei";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  ShapeUtils,
  Vector3,
} from "three";
import { Poly3 } from "@jscad/modeling/src/geometries/types";
import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import { translate, rotate } from "@jscad/modeling/src/operations/transforms";
import { triangulatePolygon } from "./utils/triangulatePolygon";
import { JscadGeometry } from "./utils/JscadGeometry";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";
import _ from "lodash";
import { ComplexTree } from "./components/ComplexTree";

const thing = {
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
};

const parseTree = (node: any) => {
  const fn = _.get(jscadModeling, node.type);
  const children = node.children?.map(parseTree) || [];
  const nodeParams = node.params || [];
  const args = _.omit(node, ["type", "params", "children"]);
  // console.log('args', args);
  if (Object.keys(args).length > 0) {
    nodeParams.unshift(args);
  }
  const fnParams = [...nodeParams, ...children];
  // console.log(node.type, ...fnParams);
  return fn(...fnParams);
};

// const { cube, cuboid, line, sphere, star } = primitives;

const bodyold = translate(
  [1, 0, 0],
  jscadModeling.primitives.cuboid({ size: [1, 1, 1] })
);
const body = parseTree(thing);
const geometry = new JscadGeometry(body);
const material = new MeshBasicMaterial({
  color: 0xff0000,
  side: DoubleSide,
  wireframe: true,
});

const Test = () => {
  const mesh = useRef<any>(null);
  // useHelper(mesh, VertexNormalsHelper, 1, 0xff00ff)
  return <mesh ref={mesh} geometry={geometry} material={material}></mesh>;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Canvas style={{ height: "100vh" }}>
        <OrbitControls />
        <ambientLight />
        <axesHelper />
        <Test />
        <ComplexTree />
        <Grid infiniteGrid fadeDistance={10} />
      </Canvas>
    </div>
  );
}

export default App;
