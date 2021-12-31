import * as rollup from 'rollup'
// @ts-ignore
import minify from 'babel-minify'

import { writeFile, copyFile } from 'fs/promises'

const INPUT_FILE = './dist/src/index.js'
const OUTPUT_FILE = './www/main.js'
const OUTPUT_FILE_MIN = './www/main.min.js'

function compress(src: string) {
  const minifiedSrc = minify(src, {
    mangle: false,
  }).code as string

  return minifiedSrc
}

async function bundle() {
  const bundle = await rollup.rollup({
    input: INPUT_FILE,
    external: ['p5/global'],
  })

  const { output } = await bundle.generate({ format: 'esm' })

  let src = ''
  for (const chunk of output) {
    if (chunk.type === 'chunk') {
      src += chunk.code
    }
  }

  await bundle.close()

  return src
}

async function build() {
  let src = await bundle()

  // remove import lines (p5/global is only imported for type support)
  src = src.replace(/^import.*/m, '')
  // rmeove export line, setup() and draw() are only exported to avoid being tree-shook
  src = src.replace(/^export.*/m, '')

  const minifiedSrc = compress(src)

  await Promise.all([
    writeFile(OUTPUT_FILE, src),
    writeFile(OUTPUT_FILE_MIN, minifiedSrc),
    copyFile('./dist/tool/tokenData.js', './www/tokenData.js'),
  ])

  console.log(`Minified Bytes: ${minifiedSrc.length}`)

  return src
}

build()

export { compress, build, bundle }
