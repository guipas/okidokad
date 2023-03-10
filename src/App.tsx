import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { booleans, colors, primitives } from "@jscad/modeling";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BufferAttribute, BufferGeometry, DoubleSide, MeshBasicMaterial, ShapeUtils, Vector3 } from 'three';
import { Poly3 } from '@jscad/modeling/src/geometries/types';
import { Vec3 } from '@jscad/modeling/src/maths/vec3';
import { translate } from '@jscad/modeling/src/operations/transforms';


const triangulatePolygon = (polygon: Poly3): number[] => {
  const chunkSize = 3;
  let vertices: number[] = [];

  for (let i = 0; i < polygon.vertices.length; i += chunkSize) {
      const chunk = polygon.vertices.slice(i, i + chunkSize);
      const point1 = chunk[0];
      let point2 = chunk[1];
      let point3 = chunk[2];
      
      if (point2 === undefined || point3 === undefined) {
        const point1Vector = new Vector3(...point1);
        const nearestPoints = polygon.vertices
          .slice()
          .map(v => ({
            point: v,
            distanceTo1: point1Vector.distanceToSquared(new Vector3(...v)),
          }))
          .sort((a, b) => a.distanceTo1 - b.distanceTo1)
          .filter((v) => v.distanceTo1 > 0)

        if (point2 === undefined) {
          point2 = nearestPoints[0].point;
          point3 = nearestPoints[1].point;
        } else if (point3 === undefined) {
          point3 = nearestPoints.filter((v) => v.point !== point2)[0].point;
        }
      }

      vertices.push(...point1);
      vertices.push(...point2);
      vertices.push(...point3);
  }

  return vertices;
}


const { cube, cuboid, line, sphere, star } = primitives;

const body = translate([1, 0, 0], cuboid({ size: [1, 1, 1] }));
const x = sphere({ radius: 0.5, center: [0.5, 0, 0] });
console.log(body)
// console.log('sphere', x);
const polygonGemetries: BufferGeometry[] = [];

const geometry = new BufferGeometry();
const vertices = new Float32Array(body.polygons.reduce<number[]>((acc, polygon, i) => {

  // const chunkSize = 3;

  // for (let i = 0; i < polygon.vertices.length; i += chunkSize) {
  //     const chunk = polygon.vertices.slice(i, i + chunkSize);

      
  //     const point1 = chunk[0];
  //     let point2 = chunk[1];
  //     let point3 = chunk[2];
      
  //     if (point2 === undefined || point3 === undefined) {
  //       const point1Vector = new Vector3(...point1);
  //       const nearestPoints = polygon.vertices
  //         .slice()
  //         .map(v => ({
  //           point: v,
  //           distanceTo1: point1Vector.distanceToSquared(new Vector3(...v)),
  //         }))
  //         .sort((a, b) => a.distanceTo1 - b.distanceTo1)
  //         .filter((v) => v.distanceTo1 > 0)

  //       if (point2 === undefined) {
  //         point2 = nearestPoints[0].point;
  //         point3 = nearestPoints[1].point;
  //       } else if (point3 === undefined) {
  //         point3 = nearestPoints.filter((v) => v.point !== point2)[0].point;
  //       }
  //     }

  //     acc.push(...point1);
  //     acc.push(...point2);
  //     acc.push(...point3);
  // }
  const vertices = triangulatePolygon(polygon);
  acc.push(...vertices);

  return acc;
}, []));

console.log('vertices', vertices)
geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
const material = new MeshBasicMaterial( { color: 0xff0000, side: DoubleSide, wireframe: true } );

const Test = () => {
  return (
    // <>
    //   {polygonGemetries.map((polygonGeometry, index) => (
    //     <mesh key={index} geometry={polygonGeometry} material={material}/>
    //   ))}
    // </>
    <mesh geometry={geometry} material={material}>
    </mesh>
  )
}


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
     <Canvas style={{ height: '90vh' }}>
        <OrbitControls />
        <ambientLight />
        <Test />
     </Canvas>
    </div>
  )
}

export default App
