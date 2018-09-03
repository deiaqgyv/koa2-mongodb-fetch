import Monk from 'monk'
import Nightmare from 'nightmare'
import request from 'superagent'
import { DB_URI, WEIBO_U, WEIBO_P, IS_SHOW, WAIT_TIME } from '../utils/config'
import { formatCookies, transformCookies } from '../utils/utils'
import userAgents from '../utils/userAgent'

const db = Monk(DB_URI)
const baseInfoDb = db.get('baseInfo')
const runInfoDb = db.get('runInfo')
const reportDb = db.get('report')
const relationDb = db.get('relation')

export const post = async (ctx) => {
  let { name, cookies } = ctx.request.body
  let autoCookies = true
  if (cookies) {
    autoCookies = false
    cookies = formatCookies(cookies)
  }
  const nightmare = Nightmare({
    show: IS_SHOW,
   })
  await nightmare
    .header('user-agent', userAgents[parseInt(Math.random() * userAgents.length)])
    .goto('https://www.qichacha.com/user_login')
    .wait('.btn-weibo')
    .click('.btn-weibo')
    .wait(WAIT_TIME)
    .type('#userId', WEIBO_U)
    .type('#passwd', WEIBO_P)

  // 如果有cookies获取手动输入的cookie，否则继续执行返回cookie
  if (!autoCookies) {
    //退回到首页
    await nightmare.back()
      .wait('.navi-brand .m-r-sm')
      .click('.navi-brand .m-r-sm')
  } else {
    cookies = await nightmare
      .wait(WAIT_TIME)
      .click('.WB_btn_login')
      .cookies.get()
      .wait(WAIT_TIME)
      .cookies.get()
  }
  // 正常登录关闭弹窗
  const closeExists = await nightmare.wait(WAIT_TIME).exists('.bindwx .close')
  if (closeExists) {
    await nightmare
      .wait(WAIT_TIME)
      .click('.bindwx .close')
      .wait(WAIT_TIME)
  }
  const firmUrl = await nightmare
    .type('#searchkey', name)
    .click('#V3_Search_bt')
    .wait(WAIT_TIME)
    .evaluate(() => document.querySelector('.m_srchList tbody a.ma_h1').href)
  await nightmare.end()
  if (autoCookies) {
    transformCookies(cookies)
  }
  const nightmare2 = Nightmare({
    show: IS_SHOW,
   })
  await nightmare2
    .header('user-agent', userAgents[parseInt(Math.random() * userAgents.length)])
    .goto(firmUrl)
    .wait(WAIT_TIME)
    .cookies.set(cookies)
    .inject('js', 'utils/fetch.js')
    .inject('js', 'node_modules/jquery/dist/jquery.js')
  // const cookie = await nightmare2.cookies.get()
  // 基本信息
  // 工商信息
  const comInfo = await nightmare2
    .evaluate(() => oneToOneDatum($, '#Cominfo', 1))
  // 股东信息
  const sockInfo = await nightmare2
    .evaluate(() => oneToManyDatum($, '#Sockinfo'))
  // 对外投资
  const touziList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#touzilist'))
  // 主要人员
  const mainMember = await nightmare2
    .evaluate(() => oneToManyDatum($, '#Mainmember'))
  // 变更记录
  const changeList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#Changelist'))

  const baseInfo = {
    'comInfo': comInfo,
    'sockInfo': JSON.stringify(sockInfo),
    'touziList': JSON.stringify(touziList),
    'mainMember': JSON.stringify(mainMember),
    'changeList': JSON.stringify(changeList),
  }
  const baseInfoRes = await baseInfoDb.findOneAndUpdate({name: name}, { name: name, data: baseInfo })
  if (!baseInfoRes) {
    await baseInfoDb.insert({ name: name, data: baseInfo })
  }
  await nightmare2
    .click('.company-nav-tab:nth-child(3) a')
    .wait(WAIT_TIME)
    .inject('js', 'utils/fetch.js')

  // 经营状况
  // 行政许可
  const permissionList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#permissionlist'))
  // 税务信用
  const taxCreditList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#taxCreditList'))
  // 产品信息
  const productList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#productlist'))
  // 融资信息
  const financingList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#financingList'))
  // 招投标信息
  const tenderlist = await nightmare2
    .evaluate(() => oneToManyDatum($, '#tenderlist'))
  // 招聘
  const joblist = await nightmare2
    .evaluate(() => oneToManyDatum($, '#joblist'))
  // 财务总览
  const finance = await nightmare2
    .evaluate(() => oneToOneDatum($, '.finance_info'))
  // 进出口信用
  const ciaxList = await nightmare2
    .evaluate(() => oneToManyDatum($, '#ciaxList'))
  const runInfo = {
    permissionList: JSON.stringify(permissionList),
    taxCreditList: JSON.stringify(taxCreditList),
    productList: JSON.stringify(productList),
    financingList: JSON.stringify(financingList),
    tenderlist: JSON.stringify(tenderlist),
    joblist: JSON.stringify(joblist),
    finance: finance,
    ciaxList: JSON.stringify(ciaxList),
  }
  const runInfoRes = await runInfoDb.findOneAndUpdate({name: name}, { name: name, data: runInfo })
  if (!runInfoRes) {
    await runInfoDb.insert({ name: name, data: runInfo })
  }
  const report = await nightmare2
    .click('.company-nav-tab:nth-child(5) a')
    .wait(WAIT_TIME)
    .inject('js', 'utils/fetch.js')
    .inject('js', 'node_modules/jquery/dist/jquery.js')
    .evaluate(() => {
      let arr = []
      $('.panel-heading .nav-tabs li').each((i, v) => {
        arr.push({
          title: $(v).text(),
          base: oneToOneDatum($, `#${i}`, 0),
          webSite: JSON.stringify(oneToManyDatum($, `#${i}`, 1)),
          gudong: JSON.stringify(oneToManyDatum($, `#${i}`, 2)),
          asset: oneToOneDatum($, `#${i}`, 3),
          shebao: shebaoDatum($, `#${i}`, 4),
        })
      })
      return arr
    })
  const reportRes = await reportDb.findOneAndUpdate({name: name}, { name: name, data: report })
  if (!reportRes) {
    await reportDb.insert({ name: name, data: report })
  }

  await nightmare2.end()

  const relationUrlRegexp = /(?<=firm_)(.*)(?=\.(shtml||html))/
  const keyNo = relationUrlRegexp.exec(firmUrl)[0]
  const reltionUrl = 'https://www.qichacha.com/company_muhouAction?keyNo=' + keyNo
  let cookiesStr = ''
  cookies.map(item => {
    cookiesStr += `${item.name}=${item.value};`
  })
  request
    .get(reltionUrl)
    .set('cookie', cookiesStr)
    .set('user-agent', userAgents[parseInt(Math.random() * userAgents.length)])
    .then(async res => {
      const relationRes = await relationDb.findOneAndUpdate({name: name},
        { name: name, data: res.body.success.results })
      if (!relationRes) {
        await relationDb.insert({ name: name, data: res.body.success.results })
      }
    })
    .catch(err => {
      console.log(err.message)
    })

  ctx.body = {
    status: 1000,
    data: 'fetch success'
  }
}