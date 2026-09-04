import * as THREE from "three";

export function curvedPlaneGeometry(
  width: number,
  height: number,
  radius: number,
  segments = 32,
) {
  const half = width / radius / 2;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const rows = 1;
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    const y = (v - 0.5) * height;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const a = -half + u * half * 2;
      pos.push(Math.sin(a) * radius, y, -(Math.cos(a) * radius - radius));
      uv.push(u, v);
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + segments + 1;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function prismGeometry(W = 3.3, H = 2.8, t = 0.66, depth = 0.62) {
  const L = Math.sqrt((W * W) / 4 + H * H);
  const nx = H / L;
  const ny = W / 2 / L;
  // inner top corners
  const s1 = (t * (1 + ny)) / H;
  const ix = -W / 2 + (s1 * W) / 2 + nx * t;
  const iy = H / 2 - t;
  // inner apex
  const s2 = 1 - (2 * H * t) / (W * L);
  const ay = H / 2 - s2 * H + ny * t;

  const shape = new THREE.Shape();
  shape.moveTo(-W / 2, H / 2);
  shape.lineTo(W / 2, H / 2);
  shape.lineTo(0, -H / 2);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(ix, iy);
  hole.lineTo(0, ay);
  hole.lineTo(-ix, iy);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}
