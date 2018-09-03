import { fetch } from '../models'
import Monk from 'monk'
import { DB_URI } from '../utils/config'

const db = Monk(DB_URI)
const baseInfoDb = db.get('baseInfo')
const runInfoDb = db.get('runInfo')
const reportDb = db.get('report')
const relationDb = db.get('relation')

export default router => {
  router.post('/api/fetch', fetch.post)
  router.get('/api/baseInfo', async (ctx) => {
    const res = await baseInfoDb.find({})
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/runInfo', async (ctx) => {
    const res = await runInfoDb.find({})
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/report', async (ctx) => {
    const res = await reportDb.find({})
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/relation', async (ctx) => {
    const res = await relationDb.find({})
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/baseInfo/:name', async ctx => {
    const res = await relationDb.findOne({ name: ctx.params.name })
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/runInfo/:name', async ctx => {
    const res = await runInfoDb.findOne({ name: ctx.params.name })
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/report/:name', async ctx => {
    const res = await reportDb.findOne({ name: ctx.params.name })
    ctx.body = {
      status: 1000,
      data: res
    }
  })
  router.get('/api/relation/:name', async ctx => {
    const res = await relationDb.findOne({ name: ctx.params.name })
    ctx.body = {
      status: 1000,
      data: res
    }
  })
}