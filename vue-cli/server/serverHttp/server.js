const http = require('http')
const fs = require('fs')
const path = require('path')

const PART_DATABASE_JSON = '/db/users.json'
const PREFIX_API_PATH = ''
const PUBLIC_DIR = '/public'
// const PICTURE_DIR = '/avatars'

const PORT = 3001

http
  .createServer(function(request, response) {
    console.log('request url', request.url)

    console.log('request method', request.method)

    console.log('request.headers ->', request.headers) // debug

    if (request.url.substr(0, PREFIX_API_PATH.length) === PREFIX_API_PATH) {
      //  API-шная часть
      // по-любому должна быть база данных, хоть пустой массив, но он должен быть
      fs.readFile('.' + PART_DATABASE_JSON, (error, contentFile) => {
        if (error) {
          const errSend =
            error.code === 'ENOENT'
              ? { code: 404, body: 'File with db users is not found' }
              : { code: 500, body: 'Server error' }
          errorEnd(errSend.code, errSend.body)
          return
        }
        // надо убедиться, что в базе что-то есть
        if (!contentFile.toString()) {
          errorEnd(404, 'Users db is empty')
          return
        }

        let contentDb = null // здесь будет находиться разобранная база данных
        try {
          contentDb = JSON.parse(contentFile.toString())
        } catch (err) {
          contentDb = '' // поймаем ошибку при проверке на массив
        }

        if (contentDb === '' || typeof contentDb !== 'object') {
          errorEnd(400, 'JSON with db has wrong format')
          return
        }

        // получаем запрос api и id-шник
        const dividerPosition = request.url.indexOf('/', PREFIX_API_PATH.length + 1)
        const pathApi =
          dividerPosition === -1
            ? request.url.slice(PREFIX_API_PATH.length)
            : request.url.slice(PREFIX_API_PATH.length, dividerPosition)
        const paramApi = dividerPosition === -1 ? '' : request.url.slice(dividerPosition + 1)
        // переменные вынесены за пределы switch по требованию линта
        let indexRecord = null
        let requestBodyBuf = null
        let contentSection = null
        let streamWriteFile = null
        let fileName = null

        // если все нормально с данными
        switch (request.method) {
          // для POST, PUT, DELETE иногда бывают двойные запросы
          case 'OPTIONS':
            allowNextEnd()
            break

          case 'GET':
            console.log('paramApi ->', paramApi) // debug
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (paramApi === '') {
                  // запрос на всех юзеров
                  contentSection = contentDb['users']
                  if (!Array.isArray(contentSection)) {
                    errorEnd(400, 'Section Users in db has wrong format')
                    return
                  }

                  if (!contentSection.length) {
                    // проверка на наличие данных
                    errorEnd(404, 'Section Users in db is empty')
                    return
                  }
                  console.log('content ->', contentSection) // debug
                  successEnd(200, JSON.stringify(contentSection))
                } else {
                  // запрос на определенного юзверя
                  // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                  contentSection = contentDb['users']
                  indexRecord = createIndexDb(contentSection).indexOf(Number(paramApi))
                  if (indexRecord === -1) {
                    // проверка на отсутствие такой записи
                    errorEnd(404, `User with id ${paramApi} does not present in db`)
                    return
                  }
                  console.log('contentSection[indexRecord] ->', contentSection[indexRecord]) // debug
                  successEnd(200, JSON.stringify(contentSection[indexRecord]))
                }
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`)
                return
            }
            break
          case 'POST':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (paramApi !== '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
                    `Param id ${paramApi} does not use with "${pathApi}" API query "${
                      request.method
                    }"`
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
                      errorEnd(400, 'Request body has wrong format')
                      return
                    }
                    contentSection = contentDb['users']
                    requestBodyObj['id'] = findMaxId(contentSection) + 1
                    console.log('requestBodyObj ->', requestBodyObj) // debug

                    contentSection.push(requestBodyObj)

                    fs.writeFile('.' + PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                      if (error) {
                        errorEnd(500, 'File db with section Users can not be writed')
                        return
                      }
                      successEnd(200, JSON.stringify(requestBodyObj)) // возвращаем тот же объект что и прилетел, но с id-шником
                    })
                  })
                break
              case '/picture':
                if (paramApi === '') {
                  {
                    errorEnd(400, 'Request has not nessesary parameter "id"')
                    return
                  }
                }
                // ставим точку перед именем файла
                fileName = `.${PUBLIC_DIR}/${paramApi}`
                console.log('add ava fileName ->', fileName) // debug

                streamWriteFile = new fs.WriteStream(fileName, {
                  highWaterMark: 128 * 1024,
                  flags: 'wx'
                })
                //  флаг wx открывает файл для записи, но кирдык если файл существует
                //  флаг w открывает файл для записи, если файл существет дописывает в него
                // мы не можен сначала проверять наличие файла на диске и потом в это имя записывать, поскольку резервирование файла должно быть атомарно
                request
                  // метод pipe переводит один поток в другой с согласованием скоростей передачи
                  .pipe(streamWriteFile)
                  // обработчик ошибок
                  .on('error', err => {
                    // стопим закачку
                    streamWriteFile.destroy()
                    // грохаем кусок файла
                    fs.unlink(fileName, () => {
                      /*nowhere to send report*/
                    })
                    if (err.code === 'EEXIST') {
                      // вероятность наличия файла ничтожно мала, но если вдруг, то пусть пользователь еще раз загружает
                      errorEnd(409, 'File with the same name was exist. Try once more')
                    } else {
                      errorEnd(502, 'Not implemented')
                    }
                  })

                  // ждем пока все закачается в файл и выкидываем в ключе link имя файла
                  .on('close', () => {
                    successEnd(
                      200,
                      // выкидываем обратно как и пришел (без точки) и добавляем улетевший слэш
                      JSON.stringify({ link: '/' + paramApi })
                    )
                    // streamWriteFile.destroy()
                  })
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`)
                return
            }
            break
          case 'PUT':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (paramApi === '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
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
                    console.log('requestBodyStr ->', requestBodyStr) // debug
                    if (requestBodyObj !== null && typeof requestBodyObj !== 'object') {
                      errorEnd(400, 'Request body has wrong format')
                      return
                    }

                    // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                    contentSection = contentDb['users']
                    indexRecord = createIndexDb(contentSection).indexOf(Number(paramApi))
                    // для всего прилетевшего объекта меняем
                    const proccessedRecord = contentSection[indexRecord]

                    // проходим по всем ключам прилетевшего объекта и меняем их в объекте базы данных
                    for (let key in requestBodyObj) {
                      /*                      if (!proccessedRecord.hasOwnProperty(key)) {
                        errorEnd(
                          400,
                          `Record in db have not field "${key}", API query "${request.method}"`
                        )
                        return
                      }*/
                      proccessedRecord[key] = requestBodyObj[key]
                    }

                    console.log('contentSection PUT ->', contentSection) // debug

                    fs.writeFile('.' + PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                      if (error) {
                        errorEnd(500, 'File with db users can not be writed')
                        return
                      }
                      successEnd(200, JSON.stringify(proccessedRecord))
                    })
                  })
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`)
                return
            }

            break
          case 'DELETE':
            // выбираем действие в зависимости от АПИ запроса
            switch (pathApi) {
              case '/users':
                if (paramApi === '') {
                  // проверка на корректность запроса
                  errorEnd(
                    400,
                    `Necessary parameter "id" is absent in "${pathApi}" API query "${
                      request.method
                    }"`
                  )
                  return
                }
                // находим позицию в массиве базы данных, предварительно создав массив из ID-шников
                contentSection = contentDb['users']
                indexRecord = createIndexDb(contentSection).indexOf(Number(paramApi))

                if (indexRecord === -1) {
                  // проверка на отсутствие такой записи
                  errorEnd(404, `User with id ${paramApi} does not present in db`)
                  return
                }
                // удаляем соответствующую запись из базы данных
                contentSection.splice(indexRecord, 1)

                console.log('content Section DELETE ->', contentSection) // debug

                fs.writeFile('.' + PART_DATABASE_JSON, JSON.stringify(contentDb), error => {
                  if (error) {
                    errorEnd(500, 'File with db users can not be writed')
                    return
                  }
                  successEnd(200, `User with "id" "${paramApi}" has been deleted`)
                })

                break
              case '/picture':
                if (paramApi === '') {
                  {
                    errorEnd(400, 'Request has not nessesary parameter "fileName"')
                    return
                  }
                }
                // ставим точку перед обращением к файлу
                fileName = `.${PUBLIC_DIR}/${paramApi}`
                console.log('del ava fileName ->', fileName) // debug
                fs.unlink(fileName, () => {
                  /*nowhere to send report*/
                })
                successEnd(200, `File "${paramApi}" has been deleted`)
                break
              default:
                errorEnd(500, `Path ${pathApi} not service by api server`)
                return
            }
            break
          default:
            errorEnd(500, `Method ${request.method} not service by api server`)
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
          errorEnd(errSend.code, errSend.body)
        } else {
          successEnd(200, contentFile, contentFileType)
        }
      })
    }

    function allowNextEnd() {
      console.log('allowNextEnd 204 ->', 204) // debug
      response.writeHead(204, {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': request.headers['origin'] || '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
      })
      response.end()
    }

    function successEnd(code, body, type) {
      console.log('successEnd code ->', code) // debug
      console.log('successEnd body ->', body) // debug
      response.writeHead(code, {
        'Access-Control-Allow-Credentials': true,
        'Content-Type': type || 'application/json',
        'Access-Control-Allow-Origin': request.headers['origin'] || '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })

      response.end(body, 'utf-8')
    }

    function errorEnd(code, message) {
      console.log('errorEnd code ->', code) // debug
      console.log('message ->', message) // debug
      response.writeHead(code, {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': request.headers['origin'] || '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      })
      // response.statusCode = errSend.code
      response.end(message)
    }
  })
  .listen(PORT)

console.log(`Server running at http://127.0.0.1:${PORT}/`)

function createIndexDb(contentSection) {
  // формируем индекс базы данных
  const indexDb = []

  contentSection.forEach((record, index) => (indexDb[index] = Number(record.id)))

  return indexDb
}
function findMaxId(contentSection) {
  // ищем максимальный ID-шник
  let maxId = null

  contentSection.forEach(record => {
    const recordId = Number(record.id)
    if (maxId === null || maxId < recordId) maxId = recordId
  })

  return maxId
}
