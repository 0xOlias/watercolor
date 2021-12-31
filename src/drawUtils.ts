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

export { drawPolygon, drawPoint }
