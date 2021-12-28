import 'p5/global';

const xs_state = Uint32Array.from([0, 0, 0, 0].map((_, i) => parseInt(window.tokenData.hash.substr(i * 8 + 2, 8), 16)));
const randDec = () => {
    let s, t = xs_state[3];
    xs_state[3] = xs_state[2];
    xs_state[2] = xs_state[1];
    xs_state[1] = s = xs_state[0];
    t ^= t << 11;
    t ^= t >>> 8;
    xs_state[0] = t ^ s ^ (s >>> 19);
    return xs_state[0] / 0x100000000;
};
const randNum = (a, b) => a + (b - a) * randDec();
const randInt = (a, b) => Math.floor(randNum(a, b + 1));
const randGaussian = () => {
    const u = 1 - randDec();
    const v = 1 - randDec();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0)
        return randGaussian();
    return num;
};

// dimension params
const WINDOW_HEIGHT = window.innerHeight;
const HEIGHT = WINDOW_HEIGHT;
const WIDTH = HEIGHT; // * 0.6;
const PADDING = 0.15 * WIDTH;
// blot primitive params
const TIERS = 4;
const SECONDARY_ITERATIONS = 3;
const LAYER_COUNT = 50;
const SIDE_MAGNITUDE_MIN = 0.4;
const SIDE_MAGNITUDE_MAX = 1.7;
// blot color params
const MIN_SATURATION = 70;
const MAX_SATURATION = 95;
const MIN_LIGHTNESS = 40;
const MAX_LIGHTNESS = 70;

const deformVertices = (vertices, magnitudeModifiers) => {
    const result = [];
    // for each side (grab 2 vertices at a time)
    for (let n = 0; n < vertices.length; n++) {
        // retrieve magnitudeModifier for parent side
        const magnitudeModifier = magnitudeModifiers[Math.floor(magnitudeModifiers.length * (n / vertices.length))];
        const [x0, y0] = vertices[n];
        const [x1, y1] = vertices[n + 1 < vertices.length ? n + 1 : 0];
        // get distance between the 2 vertices (side length)
        const sideLength = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
        // get slope between the 2 vertices (side angle)
        const gamma = Math.atan((y1 - y0) / (x1 - x0));
        // get coords of starting point somewhere on side
        const t = randGaussian();
        const startingX = (1 - t) * x0 + t * x1;
        const startingY = (1 - t) * y0 + t * y1;
        // get magnitude of deformation from side
        const magnitude = sideLength * randGaussian() * magnitudeModifier;
        // get angle of deformation from side
        const theta = Math.PI * randGaussian();
        // get coords of final desired endopint
        const finalX = startingX + (x1 < x0 ? 1 : -1) * magnitude * Math.cos(theta + gamma);
        const finalY = startingY + (x1 < x0 ? 1 : -1) * magnitude * Math.sin(theta + gamma);
        result.push([x0, y0]);
        result.push([finalX, finalY]);
    }
    return result;
};
const generateBlotLayers = ({ blotHue, sides, radius, xCenter, yCenter, }) => {
    const layers = [];
    // generate magnitude modifier array for this blot
    const magnitudeModifiers = [...Array(sides)].map(() => {
        return SIDE_MAGNITUDE_MIN + randGaussian() * (SIDE_MAGNITUDE_MAX - SIDE_MAGNITUDE_MIN);
    });
    // create regular polygon
    const regularVertices = [];
    for (let n = 0; n < sides; n++) {
        const x = xCenter + radius * Math.cos((2 * Math.PI * n) / sides);
        const y = yCenter + radius * Math.sin((2 * Math.PI * n) / sides);
        regularVertices.push([x, y]);
    }
    // set current baseVertices as the regular vertices
    let baseVertices = regularVertices;
    // for each tier
    for (let i = 0; i < TIERS; i++) {
        // deform baseVertices once
        baseVertices = deformVertices(baseVertices, magnitudeModifiers);
        // for each layer in the tier, deform n more times, then draw
        for (let j = 0; j < LAYER_COUNT / TIERS; j++) {
            let secondaryVertices = baseVertices;
            // deform current base polygon n more times
            for (let k = 0; k < SECONDARY_ITERATIONS; k++) {
                secondaryVertices = deformVertices(secondaryVertices, magnitudeModifiers);
            }
            const layerHue = (Math.floor(blotHue + 100 * (0.5 - randGaussian())) + 360) % 360;
            // add layer
            layers.push({
                layerHue: layerHue,
                vertices: secondaryVertices,
            });
        }
    }
    return layers;
};

const drawPolygon = (vertices, colorString) => {
    fill(color(colorString));
    beginShape();
    for (let n = 0; n < vertices.length; n++) {
        vertex(vertices[n][0], vertices[n][1]);
    }
    endShape(CLOSE);
};

// blot color params
const SATURATION = randInt(MIN_SATURATION, MAX_SATURATION);
const LIGHTNESS = randInt(MIN_LIGHTNESS, MAX_LIGHTNESS);
const LAYER_ALPHA = 1 / LAYER_COUNT;
// background color params
const HUE_BG = randInt(0, 360);
const SATURATION_BG = randInt(25, 35);
const LIGHTNESS_BG = 123 - SATURATION_BG;
// layers to be drawn
const blotLayers = [];
function setup() {
    createCanvas(WIDTH, HEIGHT);
    noStroke();
    background(color(`hsla(${HUE_BG}, ${SATURATION_BG}%, ${LIGHTNESS_BG}%, 1)`));
    // // RING //
    // const ringCount = 2
    // for (let c = 0; c < ringCount; c++) {
    //   const clusterHue = randInt(0, 360)
    //   const ringRadius = randInt(100, 350)
    //   const blotCount = Math.floor(ringRadius / 10)
    //   const ringCenterX = randInt(PADDING, WIDTH - PADDING)
    //   const ringCenterY = randInt(PADDING, HEIGHT - PADDING)
    //   const positionDeviation = 30
    //   for (let n = 0; n < blotCount; n++) {
    //     const blotHue = clusterHue + 25 * (0.5 - randGaussian())
    //     const sides = randInt(3, 5)
    //     const radius = randInt(5, 10)
    //     let xCenter = ringCenterX + ringRadius * Math.cos((2 * Math.PI * n) / blotCount)
    //     let yCenter = ringCenterY + ringRadius * Math.sin((2 * Math.PI * n) / blotCount)
    //     xCenter += positionDeviation * (0.5 - randGaussian())
    //     yCenter += positionDeviation * (0.5 - randGaussian())
    //     const layers = generateBlotLayers({
    //       blotHue,
    //       sides,
    //       radius,
    //       xCenter,
    //       yCenter,
    //     })
    //     blotLayers.push(layers)
    //   }
    // }
    // GRID //
    const rowCount = randInt(2, 8);
    const columnCount = randInt(2, 8);
    const positionDeviation = 70;
    for (let i = 0; i < rowCount; i++) {
        const clusterHue = randInt(0, 360);
        for (let j = 0; j < columnCount; j++) {
            const blotHue = clusterHue + 25 * (0.5 - randGaussian());
            const sides = randInt(3, 5);
            const radius = randInt(10, 15);
            let xCenter = j * ((WIDTH - 2 * PADDING) / (columnCount - 1)) + PADDING;
            let yCenter = i * ((HEIGHT - 2 * PADDING) / (rowCount - 1)) + PADDING;
            xCenter += positionDeviation * (0.5 - randGaussian());
            yCenter += positionDeviation * (0.5 - randGaussian());
            const layers = generateBlotLayers({ blotHue, sides, radius, xCenter, yCenter });
            blotLayers.push(layers);
        }
    }
}
let currentLayer = 0;
function draw() {
    blotLayers.forEach((blotLayer) => {
        const { layerHue, vertices } = blotLayer[currentLayer];
        const colorString = `hsla(${layerHue},${SATURATION}%,${LIGHTNESS}%,${LAYER_ALPHA})`;
        drawPolygon(vertices, colorString);
    });
    // if (currentLayer === 0) {
    // noFill()
    // stroke(color('black'))
    // strokeWeight(2)
    // square(PADDING, PADDING, WIDTH - 2 * PADDING)
    // noStroke()
    // }
    // if (currentLayer === 0) {
    // dots.forEach((dot) => {
    //   const [x, y] = dot
    //   const colorString = 'black'
    //   drawPoint(x, y, colorString)
    // })
    // }
    currentLayer += 1;
    if (currentLayer === LAYER_COUNT) {
        noLoop();
    }
}

export { draw, setup };
