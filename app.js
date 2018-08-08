import Koa from 'koa'
import router from './router'
import cors from 'koa2-cors'
import koaBody from 'koa-body'
import relation from './fetch/relation'
const app = new Koa()

app
  .use(cors())
  .use(koaBody())
  // .use(relation)
  .use(router.routes())
  .listen(3000)