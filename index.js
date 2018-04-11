const client = require('cheerio-httpcli')
const tough = require('tough-cookie')
const request = require('request-promise')

const email = process.env.EMAIL
const password = process.env.PASSWORD
const webhook = process.env.SLACK_WEBHOOK
const channel = process.env.SLACK_CHANNEL
const mention = process.env.SLACK_MENTION

const fetchCheckedCount = async userToken => {
  const cookie = new tough.Cookie({
    key: 'user',
    value: userToken,
    path: '/',
    domain: 'techbookfest.org'
  })
  const jar = request.jar()
  jar.setCookie(cookie, 'https://techbookfest.org')
  const opt = {
    url: 'https://techbookfest.org/api/circle/own',
    jar
  }
  const circles = JSON.parse(await request(opt))
  const checkedCount = circles.filter(circle => circle.event.id === 'tbf04').map(circle => circle.checkedCount)[0]
  return checkedCount
}

const re = /^user=([^;]+)/

const signIn = async () => {
  const opt = {
    method: 'POST',
    uri: 'https://techbookfest.org/api/user/login',
    body: JSON.stringify({ email, password }),
    headers: {
      'content-type': 'application/json'
    },
    resolveWithFullResponse: true
  }
  const res = await request(opt)
  const matched = re.exec(res.headers['set-cookie'][0])
  return matched[1]
}

const crawl = async () => {
  const userToken = await signIn()
  const checkedCount = await fetchCheckedCount(userToken)
  return checkedCount
}

const sendToSlack = async message => {
  const opt = {
    method: 'POST',
    uri: webhook,
    json: {
      channel,
      text: message
    }
  }
  await request(opt)
}

const sendCheckedcountToSlack = async () => {
  const checkedCount = await crawl()
  await sendToSlack(`<@${mention}>
技術書典04 ${new Date().toLocaleString()}における被サークルチェック数: ${checkedCount}`)
  return checkedCount
}

const sleep = count =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), count)
  })

exports.handler = () => {
  return new Promise(()=>{
    sendCheckedcountToSlack()
    .then(()=>{
      console.log(new Date().toLocaleString(), checkedCount)
      return Promise.resolve()
    })
    .catch(()=>{
      console.error(e)
      return Promise.resolve()
    })
  })
}
