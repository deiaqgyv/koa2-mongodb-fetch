import { relation } from '../models'

export default router => {
  router.get('/api/relation', relation.get)
  router.post('/api/relation', relation.post)
}