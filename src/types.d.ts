interface Layer {
  layerHue: number
  vertices: number[][]
}

interface Blot {
  layers: Layer[]
}

export { Layer, Blot }
