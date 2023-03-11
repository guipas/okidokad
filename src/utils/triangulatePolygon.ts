import { Poly3 } from "@jscad/modeling/src/geometries/poly3";
import { Vector3 } from "three";

export const triangulatePolygon = (polygon: Poly3): number[] => {
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
