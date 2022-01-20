import liveServer from 'live-server'

import { build } from './build.js'

const PORT = 8081

console.log(`Starting development server on http://localhost:${PORT}`)

liveServer.start({
  port: PORT,
  logLevel: 2,
  open: false,
  root: './www',
  // @ts-ignore
  watch: ['index.html', 'main.min.js'],
  middleware: [
    async (req, res, next) => {
      if (req.url === '/main.min.js') {
        const src = await build()
        res.setHeader('Content-Type', 'text/javascript')
        res.end(src)
      } else {
        next(null)
      }
    },
  ],
})
