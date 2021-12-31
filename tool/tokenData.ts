// helper functions that will not be included in prod

// helper for generating tokenData locally (get for free in prod)
function genTokenData(projectNum: number) {
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16)
  }

  const tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString()

  return {
    hash: hash,
    tokenId: tokenId,
  }
}

window.tokenData = genTokenData(1738)
