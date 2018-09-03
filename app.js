import Koa from 'koa'
import router from './router'
import cors from 'koa2-cors'
import koaBody from 'koa-body'
const app = new Koa()

app
  .use(cors())
  .use(koaBody())
  .use(router.routes())
  .listen(3000)

  console.log('listen on 3000 port')