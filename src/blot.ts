import { randGaussian } from './rand'
import { drawPolygon } from './drawUtils'

import {
  TIERS,
  SECONDARY_ITERATIONS,
  LAYER_COUNT,
  SIDE_MAGNITUDE_MIN,
  SIDE_MAGNITUDE_MAX,
  LAYER_HUE_DEVIATION_MAGNITUDE,
} from './params'
import type { ILayerData } from './types'

const deformVertices = (vertices: number[][], magnitudeModifiers: number[]) => {
  const result = []

  // for each side (grab 2 vertices at a time)
  for (let n = 0; n < vertices.length; n++) {
    // retrieve magnitudeModifier for parent side
    const magnitudeModifier =
      magnitudeModifiers[Math.floor(magnitudeModifiers.length * (n / vertices.length))]

    const [x0, y0] = vertices[n]
    const [x1, y1] = vertices[n + 1 < vertices.length ? n + 1 : 0]

    // get distance between the 2 vertices (side length)
    const sideLength = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)

    // get slope between the 2 vertices (side angle)
    const gamma = Math.atan((y1 - y0) / (x1 - x0))

    // get coords of starting point somewhere on side
    const t = randGaussian()
    const startingX = (1 - t) * x0 + t * x1
    const startingY = (1 - t) * y0 + t * y1

    // get magnitude of deformation from side
    const magnitude = sideLength * randGaussian() * magnitudeModifier

    // get angle of deformation from side
    const theta = Math.PI * randGaussian()

    // get coords of final desired endopint
    const finalX = startingX + (x1 < x0 ? 1 : -1) * magnitude * Math.cos(theta + gamma)
    const finalY = startingY + (x1 < x0 ? 1 : -1) * magnitude * Math.sin(theta + gamma)

    result.push([x0, y0])
    result.push([finalX, finalY])
  }

  return result
}

const generateBlotLayers = ({
  blotHue,
  sides,
  radius,
  xCenter,
  yCenter,
}: {
  blotHue: number
  sides: number
  radius: number
  xCenter: number
  yCenter: number
}): ILayerData[] => {
  const layers = []

  // generate magnitude modifier array for this blot
  const magnitudeModifiers = [...Array(sides)].map(() => {
    return SIDE_MAGNITUDE_MIN + randGaussian() * (SIDE_MAGNITUDE_MAX - SIDE_MAGNITUDE_MIN)
  })

  // create regular polygon
  const regularVertices: number[][] = []
  for (let n = 0; n < sides; n++) {
    const x = xCenter + radius * Math.cos((2 * Math.PI * n) / sides)
    const y = yCenter + radius * Math.sin((2 * Math.PI * n) / sides)

    regularVertices.push([x, y])
  }

  // set current baseVertices as the regular vertices
  let baseVertices = regularVertices

  // for each tier
  for (let i = 0; i < TIERS; i++) {
    // deform baseVertices once
    baseVertices = deformVertices(baseVertices, magnitudeModifiers)

    // for each layer in the tier, deform n more times, then draw
    for (let j = 0; j < LAYER_COUNT / TIERS; j++) {
      let secondaryVertices = baseVertices

      // deform current base polygon n more times
      for (let k = 0; k < SECONDARY_ITERATIONS; k++) {
        secondaryVertices = deformVertices(secondaryVertices, magnitudeModifiers)
      }

      const layerHue =
        (Math.floor(blotHue + LAYER_HUE_DEVIATION_MAGNITUDE * (0.5 - randGaussian())) + 360) % 360

      // add layer
      layers.push({
        layerHue: layerHue,
        vertices: secondaryVertices,
      })
    }
  }

  return layers
}

export { deformVertices, generateBlotLayers }
