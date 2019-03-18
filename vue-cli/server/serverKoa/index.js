// cd vue-cli/server/serverKoa

'use strict'

const PORT = 3002

const Koa = require('koa')
const favicon = require('koa-favicon')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')

const app = new Koa()

app.use(favicon())
app.use(bodyParser({ jsonLimit: '56kb' }))
app.use(async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': ctx.get('Origin'),
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
  return next()
})

const router = new Router()

router.options('/users', async ctx => {
  ctx.set({
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
  })

  ctx.body = null
})
router.get('/users', async ctx => {
  // задаем заголовки данных для отправки
  console.log('get users ->', [{ id: 1, firstName: 'Ivan' }, { id: 2, firstName: 'Arkady' }]) // debug
  ctx.response.body = [{ id: 1, firstName: 'Ivan' }, { id: 2, firstName: 'Arkady' }]
})

router.get('/users/:userId', async ctx => {
  // задаем заголовки данных для отправки
  // ctx.set('Cache-Control', 'no-cache,must-revalidate')
  let user = null

  switch (ctx.params.userId) {
    case '1':
      user = { id: 1, firstName: 'Ivan' }
      break
    case '2':
      user = { id: 2, firstName: 'Arkady' }
      break
  }
  console.log('get user ->', user) // debug
  ctx.response.body = user
})

router.post('/users', async ctx => {
  console.log('ctx.request.body ->', await ctx.request.body) // debug

  // console.log('ctx.body ->', ctx.body) // debug
  ctx.response.body = 'ok2'
})

router.put('/user/:userId', async ctx => {
  // то, что написано через двоеточие, можем вытащить через ctx.papams.
  console.log('ctx.request.body ->', await ctx.request.body) // debug
  console.log('userId ->', ctx.params.userId) // debug
  // console.log('ctx.body ->', ctx.body) // debug
  ctx.response.body = 'ok3'
})

// подцепляем роутер
app.use(router.routes())

// слушаем сервер
app.listen(PORT)
