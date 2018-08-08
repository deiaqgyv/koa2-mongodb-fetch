import Monk from 'monk'
import { DB_URI } from '../utils/config'
import request from 'superagent'
const db = Monk(DB_URI)
const collection = db.get('relationship')

export const get = async (ctx) => {
  await collection.find({})
    .then(res => {
      ctx.body = {
        status: 1000,
        data: res
      }
    })
    .catch(() => {
      ctx.body = {
        status: 1001,
        data: {
          info: '出错了'
        }
      }
    })
    .then(() => db.close())
}

export const post = (ctx) => {
  let { relationUrl } = ctx.request.body
  const regexp = /(?<=keyNo=)(.*)(?=&)/
  if (!regexp.exec(relationUrl)) {
    ctx.status = 403
    return
  }
  const keyNo = regexp.exec(relationUrl)[0]
  return request
    .get(`https://www.qichacha.com/company_muhouAction?keyNo=${keyNo}`)
    .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
    .set('accept-encoding', 'gzip, deflate, br')
    .set('accept-language', 'zh-CN,zh;q=0.9')
    .set('cache-control', 'no-cache')
    .set('cookie', 'zg_did=%7B%22did%22%3A%20%221650d18e550310-0158653148fe24-737356c-1fa400-1650d18e551466%22%7D; UM_distinctid=1650d18e63f5a4-0391f5f0e6eabe-737356c-1fa400-1650d18e6406c6; _uab_collina=153352306032888692211224; PHPSESSID=o6fot69p0jo5f3g51ov368h2u2; hasShow=1; _umdata=C234BF9D3AFA6FE76D6A16DD3611DCBC5FB1CB6F132B1519EC52DD12927F13264CC0DC0C4B617169CD43AD3E795C914C64432CFFF9051E57CAE8131901BCB7E2; acw_tc=AQAAAFKwSjvfnAkASnrEeAGP8DS/Le29; CNZZDATA1254842228=1152370964-1533519862-https%253A%252F%252Fwww.qichacha.com%252F%7C1533712445; Hm_lvt_3456bee468c83cc63fb5147f119f1075=1533181191,1533522522,1533711018,1533712910; Hm_lpvt_3456bee468c83cc63fb5147f119f1075=1533712914; zg_de1d1a35bfa24ce29bbf2c7eb17e6c4f=%7B%22sid%22%3A%201533712909127%2C%22updated%22%3A%201533713676096%2C%22info%22%3A%201533523060056%2C%22superProperty%22%3A%20%22%7B%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22www.baidu.com%22%2C%22cuid%22%3A%20%226ac70b3587240769eba44e25431167ba%22%7D')
    .set('pragma', 'no-cache')
    .set('sec-metadata', 'cause=forced, destination=document, target=top-level, site=same-origin')
    .set('upgrade-insecure-requests', '1')
    .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36')
    .then((res) => {
      return collection.insert(res.body.success.results)
    }).then((data) => {
      ctx.body = {
        status: 1000,
        data: data
      }
    })
}