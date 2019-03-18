const http = require('http')
const fs = require('fs')
const path = require('path')

const PART_DATABASE_JSON = '../../db/users.json'
const PREFIX_API_PATH = ''
const PUBLIC_DIR = '../../public'

const PORT = 3001

http
  .createServer(function(request, response) {
    console.log('request url', request.url)

    console.log('request method', request.method)

    console.log('request.headers ->', request.headers) // debug

    if (request.url.substr(0, PREFIX_API_PATH.length) === PREFIX_API_PATH) {
      //  API-шная часть
      // по-любому должна быть база данных, хоть пустой массив, но он должен быть
      fs.readFile(PART_DATABASE_JSON, (error, contentFile) => {
        if (error) {
          const errSend =
            error.code === 'ENOENT'
              ? { code: 404, body: 'File with db users is not found' }
              : { code: 500, body: 'Server error' }
          errorEnd(errSend.code, errSend.body, response)
          return
        }
        // надо убедиться, что в базе что-то есть
        if (!contentFile.toString()) {
          errorEnd(404, 'Users db is empty', response)
          return
        }

        let contentDb = null // здесь будет находиться разобранная база данных
        try {
          contentDb = JSON.parse(contentFile.toString())['users']
        } catch (err) {
          contentDb = '' // поймаем ошибку при проверке на массив
        }

        if (!Array.isArray(contentDb)) {
          errorEnd(400, 'Users db has wrong format', response)
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
          // для POST, PUT, DELETE иногда бывают двойные запросы
          case 'OPTIONS':
            response.writeHead(200, {
              // 'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
            })
            response.end()
            break

          case 'GET':
            console.log('idApi ->', idApi) // debug
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (idApi === '') {
                  // запрос на всех юзеров
                  if (!contentDb.length) {
                    // проверка на наличие данных
                    errorEnd(404, 'Users db is empty', response)
                    return
                  }
                  console.log('content ->', contentDb) // debug
                  successEnd(200, JSON.stringify(contentDb), response)
                } else {
                  // запрос на определенного юзверя
                  // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                  indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))
                  if (indexRecord === -1) {
                    // проверка на отсутствие такой записи
                    errorEnd(404, `User with id ${idApi} does not present in db`, response)
                    return
                  }
                  console.log('contentDb[indexRecord] ->', contentDb[indexRecord]) // debug
                  successEnd(200, JSON.stringify(contentDb[indexRecord]), response)
                }
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`, response)
                return
            }
            break
          case 'POST':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (idApi !== '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
                    `Param id ${idApi} does not use with "${pathApi}" API query "${
                      request.method
                    }"`,
                    response
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
                    console.log('requestBodyStr ->', requestBodyStr) // debug
                    console.log('typeof requestBodyObj ->', typeof requestBodyObj) // debug

                    if (requestBodyObj === null || typeof requestBodyObj !== 'object') {
                      errorEnd(400, 'Request body has wrong format', response)
                      return
                    }

                    requestBodyObj['id'] = findMaxId(contentDb) + 1
                    console.log('requestBodyObj ->', requestBodyObj) // debug

                    contentDb.push(requestBodyObj)

                    fs.writeFile(
                      PART_DATABASE_JSON,
                      JSON.stringify({ users: contentDb }),
                      error => {
                        if (error) {
                          errorEnd(500, 'File with db users can not be writed', response)
                          return
                        }
                        successEnd(200, JSON.stringify(requestBodyObj), response)
                      }
                    )
                  })
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`, response)
                return
            }
            break
          case 'PUT':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (idApi === '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`,
                    response
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
                    console.log('requestBodyStr ->', requestBodyStr) // debug
                    if (requestBodyObj !== null && typeof requestBodyObj !== 'object') {
                      errorEnd(400, 'Request body has wrong format', response)
                      return
                    }

                    // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                    const indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))
                    // для всего прилетевшего объекта меняем
                    const proccessedRecord = contentDb[indexRecord]

                    // проходим по всем ключам прилетевшего объекта и меняем их в объекте базы данных
                    for (let key in requestBodyObj) {
                      if (!proccessedRecord.hasOwnProperty(key)) {
                        errorEnd(
                          400,
                          `Record in db have not field "${key}", API query "${request.method}"`,
                          response
                        )
                        return
                      }
                      proccessedRecord[key] = requestBodyObj[key]
                    }

                    console.log('contentDb ->', contentDb) // debug

                    fs.writeFile(
                      PART_DATABASE_JSON,
                      JSON.stringify({ users: contentDb }),
                      error => {
                        if (error) {
                          errorEnd(500, 'File with db users can not be writed', response)
                          return
                        }
                        successEnd(200, proccessedRecord, response)
                      }
                    )
                  })
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`, response)
                return
            }

            break
          case 'DELETE':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (idApi === '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`,
                    response
                  )
                  return
                }
                // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                indexRecord = createIndexDb(contentDb).indexOf(Number(idApi))

                if (indexRecord === -1) {
                  // проверка на отсутствие такой записи
                  errorEnd(404, `User with id ${idApi} does not present in db`, response)
                  return
                }
                // удаляем соответствующую запись из базы данных
                contentDb.splice(indexRecord, 1)

                console.log('contentDb ->', contentDb) // debug

                fs.writeFile(PART_DATABASE_JSON, JSON.stringify({ users: contentDb }), error => {
                  if (error) {
                    errorEnd(500, 'File with db users can not be writed', response)
                    return
                  }
                  successEnd(200, `User with "id" "${idApi}" has been deleted`, response)
                })

                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`, response)
                return
            }
            break
          default:
            errorEnd(500, `Method ${request.method} not service by api server`, response)
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
          errorEnd(errSend.code, errSend.body, response)
        } else {
          successEnd(200, contentFile, response, contentFileType)
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

function successEnd(code, body, response, type) {
  console.log('successEnd ->', code) // debug
  response.writeHead(code, {
    'Content-Type': type || 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })

  /*  response.writeHead(200, {
    'Content-Type': type || 'application/json'
  })*/
  response.end(body, 'utf-8')
}

function errorEnd(code, message, response) {
  console.log('errorEnd ->', code) // debug
  response.writeHead(code, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  })
  // response.statusCode = errSend.code
  response.end(message)
}
