const drawPolygon = (vertices: number[][], colorString: string) => {
  fill(color(colorString))
  beginShape()
  for (let n = 0; n < vertices.length; n++) {
    vertex(vertices[n][0], vertices[n][1])
  }
  endShape(CLOSE)
}

const drawPoint = (x: number, y: number, colorString: string) => {
  stroke(color(colorString))
  strokeWeight(3)
  point(x, y)
  noStroke()
}

export { drawPolygon, drawPoint }
