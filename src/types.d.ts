interface Layer {
  hue: number
  vertices: number[][]
}

interface Blot {
  layers: Layer[]
  startAngle: number
}

export { Layer, Blot }
