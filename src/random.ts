const xs_state = Uint32Array.from(
  [0, 0, 0, 0].map((_, i) => parseInt(window.tokenData.hash.substr(i * 8 + 2, 8), 16))
)

const randDec = () => {
  let s,
    t = xs_state[3]
  xs_state[3] = xs_state[2]
  xs_state[2] = xs_state[1]
  xs_state[1] = s = xs_state[0]
  t ^= t << 11
  t ^= t >>> 8
  xs_state[0] = t ^ s ^ (s >>> 19)
  return xs_state[0] / 0x100000000
}

const randNum = (a: number, b: number) => a + (b - a) * randDec()

const randInt = (a: number, b: number) => Math.floor(randNum(a, b + 1))

const randGaussian = (): number => {
  const u: number = 1 - randDec()
  const v: number = 1 - randDec()

  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5
  if (num > 1 || num < 0) return randGaussian()
  return num
}

const randomGaussianTruncated = () => 2 * Math.abs(randGaussian() - 0.5)

export { randDec, randNum, randInt, randGaussian, randomGaussianTruncated }
