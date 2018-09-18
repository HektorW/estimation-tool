const { join } = require('path')
const Koa = require('koa')
const koaLogger = require('koa-logger')
const koaStatic = require('koa-static')

const port = process.env.PORT || 4006
const serveDirectory = join(__dirname, 'client')

const app = new Koa()

if (process.env.NODE_ENV === 'production') {
  app.use(async (ctx, next) => {
    if (ctx.headers['x-forwarded-proto'] !== 'https') {
      ctx.redirect(`https://${ctx.request.host}${ctx.request.url}`)
    } else {
      await next()
    }
  })
}

app.use(koaLogger())
app.use(koaStatic(serveDirectory))

app.listen(port, () => {
  console.log(`### Estimation-tool server running at port=${port} ###`)
})
