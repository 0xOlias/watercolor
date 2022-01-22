const drawPolygon = (vertices: number[][]) => {
  beginShape()
  for (let n = 0; n < vertices.length; n++) {
    vertex(vertices[n][0], vertices[n][1])
  }
  endShape(CLOSE)
}

const drawPoint = (_point: number[]) => {
  point(_point[0], _point[1])
  noStroke()
}

const isPointInPolygon = (point: number[], polygon: number[][]) => {
  const x = point[0]
  const y = point[1]
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]
    const xj = polygon[j][0]
    const yj = polygon[j][1]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

const rotate = (point: number[], origin: number[], angle: number) => {
  const radians = (Math.PI / 180) * angle
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (point[0] - origin[0]) + sin * (point[1] - origin[1]) + origin[0]
  const ny = cos * (point[1] - origin[1]) - sin * (point[0] - origin[0]) + origin[1]
  return [nx, ny]
}

export { drawPolygon, drawPoint, isPointInPolygon, rotate }
