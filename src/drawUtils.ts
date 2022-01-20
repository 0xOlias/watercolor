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

const pointInPolygon = (point: number[], polygon: number[][]) => {
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

export { drawPolygon, drawPoint, pointInPolygon }
