const http = require('http')
const fs = require('fs')
const path = require('path')

const PART_DATABASE_JSON = '../db/users.json'
const PREFIX_API_PATH = '/api'
const PUBLIC_DIR = '../public'

const PORT = 3000

http
  .createServer(function(request, response) {
    console.log('request url', request.url)
    console.log('request method', request.method)

    if (request.url.substr(0, PREFIX_API_PATH.length) === PREFIX_API_PATH) {
      //  API-шная часть
      // по-любому должна быть база данных, хоть пустой массив, но он должен быть
      fs.readFile(PART_DATABASE_JSON, (error, contentFile) => {
        if (error) {
          const errSend =
            error.code === 'ENOENT'
              ? { code: 404, body: 'File with db users is not found' }
              : { code: 500, body: 'Server error' }
          response.statusCode = errSend.code
          response.end(errSend.body)
          return
        }
        // надо убедиться, что в базе что-то есть
        if (!contentFile.toString()) {
          response.statusCode = 404
          response.end('Users db is empty')
          return
        }

        let contentDb = null // здесь будет находиться разобранная база данных
        try {
          contentDb = JSON.parse(contentFile.toString())
        } catch (err) {
          contentDb = '' // поймаем ошибку при проверке на массив
        }

        if (!Array.isArray(contentDb)) {
          response.statusCode = 400
          response.end('Users db has wrong format')
          return
        }

        // получаем запрос api и id-шник
        const dividerPosition = request.url.indexOf('/', PREFIX_API_PATH.length + 1)
        const pathApi =
          dividerPosition === -1
            ? request.url.slice(PREFIX_API_PATH.length)
            : request.url.slice(PREFIX_API_PATH.length, dividerPosition)
        const idApi = dividerPosition === -1 ? '' : request.url.slice(dividerPosition + 1)
        // переменные вынесены за пределы switch по требованию линта
        let indexRecord = null
        let requestBodyBuf = null

        // если все нормально с данными
        switch (request.method) {
          case 'GET':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (idApi !== '') {
                  // проверка на корректность запроса
                  response.statusCode = 400
                  response.end(
                    `Param id ${idApi} does not use with "${pathApi}" API query "${request.method}"`
                  )
                  return
                }

                if (!contentDb.length) {
                  // проверка на наличие данных
                  response.statusCode = 404
                  response.end('Users db is empty')
                  return
                }

                console.log('content ->', contentFile.toString()) // debug

                response.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                })
                response.end(contentFile, 'utf-8')

                break
              case '/user':
                if (idApi === '') {
                  // проверка на корректность запроса
                  response.statusCode = 400
                  response.end(
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`
                  )
                  return
                }
                // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))

                if (indexRecord === -1) {
                  // проверка на отсутствие такой записи
                  response.statusCode = 404
                  response.end(`User with id ${idApi} does not present in db`)
                  return
                }

                console.log('contentDb[indexRecord] ->', contentDb[indexRecord]) // debug

                response.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                })
                response.end(JSON.stringify(contentDb[indexRecord]), 'utf-8')
                break
              default:
                response.statusCode = 500
                response.end(`Path ${pathApi} not service by api server`)
                return
            }
            break
          case 'POST':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/user':
                if (idApi !== '') {
                  // проверка на корректность запроса
                  response.statusCode = 400
                  response.end(
                    `Param id ${idApi} does not use with "${pathApi}" API query "${request.method}"`
                  )
                  return
                }
                // находим позицию в массиве базы данных, предварительно создав массив из ID-шников

                // тут ловим прилетевшие данные (связываем несколько чанков, поскольку джисон может быть длинным)
                requestBodyBuf = []

                request
                  .on('data', chunk => requestBodyBuf.push(chunk))
                  .on('end', () => {
                    const requestBodyStr = Buffer.concat(requestBodyBuf).toString()
                    let requestBodyObj = null
                    try {
                      requestBodyObj = JSON.parse(requestBodyStr)
                    } catch (err) {
                      requestBodyObj = ''
                    }
                    if (requestBodyObj !== null && typeof requestBodyObj === 'object') {
                      response.statusCode = 400
                      response.end('Request body has wrong format')
                      return
                    }

                    requestBodyObj['id'] = findMaxId(contentDb) + 1

                    contentDb.push(requestBodyObj)

                    console.log('contentDb ->', contentDb) // debug

                    fs.writeFile(PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                      if (error) {
                        response.statusCode = 500
                        response.end('File with db users can not be writed')
                        return
                      }

                      response.statusCode = 200
                      response.end(`User with "id" "${idApi}" has been added to db`)
                    })
                  })
                break
              default:
                response.statusCode = 500
                response.end(`Path ${pathApi} not service by api server`)
                return
            }
            break
          case 'PUT':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/user':
                if (idApi === '') {
                  // проверка на корректность запроса
                  response.statusCode = 400
                  response.end(
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`
                  )
                  return
                }
                // тут ловим прилетевшие данные (связываем несколько чанков, поскольку джисон может быть длинным)
                requestBodyBuf = []
                request
                  .on('data', chunk => requestBodyBuf.push(chunk))
                  .on('end', () => {
                    const requestBodyStr = Buffer.concat(requestBodyBuf).toString()
                    let requestBodyObj = null
                    try {
                      requestBodyObj = JSON.parse(requestBodyStr)
                    } catch (err) {
                      requestBodyObj = ''
                    }
                    console.log('typeof requestBodyObj ->', typeof requestBodyObj) // debug
                    if (requestBodyObj !== null && typeof requestBodyObj !== 'object') {
                      response.statusCode = 400
                      response.end('Request body has wrong format')
                      return
                    }

                    // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                    const indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))
                    // для всего прилетевшего объекта меняем
                    const proccessedRecord = contentDb[indexRecord]

                    // проходим по всем ключам прилетевшего объекта и меняем их в объекте базы данных
                    for (let key in requestBodyObj) {
                      if (!proccessedRecord.hasOwnProperty(key)) {
                        response.statusCode = 400
                        response.end(
                          `Record in db have not field "${key}", API query "${request.method}"`
                        )
                        return
                      }
                      proccessedRecord[key] = requestBodyObj[key]
                    }

                    console.log('contentDb ->', contentDb) // debug

                    fs.writeFile(PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                      if (error) {
                        response.statusCode = 500
                        response.end('File with db users can not be writed')
                        return
                      }

                      response.statusCode = 200
                      response.end(`User with "id" "${idApi}" has been updated`)
                    })
                  })
                break
              default:
                response.statusCode = 500
                response.end(`Path ${pathApi} not service by api server`)
                return
            }

            break
          case 'DELETE':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/user':
                if (idApi === '') {
                  // проверка на корректность запроса
                  response.statusCode = 400
                  response.end(
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`
                  )
                  return
                }
                // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))

                if (indexRecord === -1) {
                  // проверка на отсутствие такой записи
                  response.statusCode = 404
                  response.end(`User with id ${idApi} does not present in db`)
                  return
                }
                // удаляем соответствующую запись из базы данных
                contentDb.splice(indexRecord)

                console.log('contentDb ->', contentDb) // debug

                fs.writeFile(PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                  if (error) {
                    response.statusCode = 500
                    response.end('File with db users can not be writed')
                    return
                  }

                  response.statusCode = 200
                  response.end(`User with "id" "${idApi}" has been deleted`)
                })

                break
              default:
                response.statusCode = 500
                response.end(`Path ${pathApi} not service by api server`)
                return
            }
            break
          default:
            response.statusCode = 500
            response.end(`Method ${request.method} not service by api server`)
            return
        }
      })
    } else {
      // обычный сервер на выдачу файлов
      const filePath = request.url === '/' ? PUBLIC_DIR + '/index.html' : PUBLIC_DIR + request.url // текущая директория сервера

      const extname = String(path.extname(filePath)).toLowerCase()

      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
      }

      const contentFileType = mimeTypes[extname] || 'application/octet-stream'

      fs.readFile(filePath, (error, contentFile) => {
        if (error) {
          const errSend =
            error.code === 'ENOENT'
              ? { code: 404, body: 'File is not found' }
              : { code: 500, body: 'Server error' }
          response.statusCode = errSend.code
          response.end(errSend.body)
        } else {
          response.writeHead(200, { 'Content-Type': contentFileType })
          response.end(contentFile, 'utf-8')
        }
      })
    }
  })
  .listen(PORT)

console.log(`Server running at http://127.0.0.1:${PORT}/`)

function createIndexDb(contentDb) {
  // формируем индекс базы данных
  const indexDb = []

  contentDb.forEach((record, index) => (indexDb[index] = Number(record.id)))

  return indexDb
}
function findMaxId(contentDb) {
  // ищем максимальный ID-шник
  let maxId = null

  contentDb.forEach(record => {
    const recordId = Number(record.id)
    if (maxId === null || maxId < recordId) maxId = recordId
  })

  return maxId
}
