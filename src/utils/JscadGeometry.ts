import { Geom3, Poly3 } from "@jscad/modeling/src/geometries/types";
import { BufferAttribute, BufferGeometry, Matrix4, Vector3 } from "three";

export interface JscadGeometryOptions {
  doTransforms?: boolean;
}

export class JscadGeometry extends BufferGeometry {
  constructor(jscadGeometry: Geom3, options: JscadGeometryOptions = { doTransforms: true }) {
    super();

    const vertices = new Float32Array(jscadGeometry.polygons.reduce<number[]>((acc, polygon, i) => {


      const vertices = JscadGeometry.triangulatePolygon(polygon);
      acc.push(...vertices);
    
      return acc;
    }, []));

    this.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );

    if (jscadGeometry.transforms && options.doTransforms) {
      const transforms = new Matrix4();
      transforms.set(...jscadGeometry.transforms).transpose();
      this.applyMatrix4(transforms);
    }
    this.computeVertexNormals();
  }

  static triangulatePolygon(polygon: Poly3): number[] {
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
}
