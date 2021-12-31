interface ILayerData {
  layerHue: number
  vertices: number[][]
}

interface IBlotData {
  layers: ILayerData[]
}

export { ILayerData, IBlotData }
