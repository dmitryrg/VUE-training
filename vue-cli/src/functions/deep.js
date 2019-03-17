export function equalObj(objFirst, objSecond) {
  if (Array.isArray(objFirst)) {
    if (!Array.isArray(objSecond)) {
      return false
    }

    for (let i = 0, l = objFirst.length; i < l; i++) {
      if (typeof objFirst[i] === 'object') {
        // вызывает рекурсивно функцию с обоими объектами
        if (!equalObj(objFirst[i], objSecond[i])) {
          return false
        }

        continue
      }
      // здесь обрабатываются премитивы
      if (objFirst[i] !== objSecond[i]) {
        return false
      }
    }
  } else {
    // первый объект точно не массив
    if (Array.isArray(objSecond)) {
      return false
    }

    for (let elem in objFirst) {
      if (typeof objFirst[elem] === 'object') {
        // вызывает рекурсивно функцию с обоими объектами
        if (!equalObj(objFirst[elem], objSecond[elem])) {
          return false
        }

        continue
      }
      // здесь обрабатываются примитивы
      // здесь обрабатываются премитивы
      if (objFirst[elem] !== objSecond[elem]) {
        return false
      }
    }
  }

  // если нигде не вылетели и пришли сюда
  return true
}

export function copyObj(objSource) {
  const objBuild = {}
  buildObj(objSource, objBuild)
  return objBuild
}

function buildObj(objSource, objBuild) {
  if (Array.isArray(objSource)) {
    for (let i = 0, l = objSource.length; i < l; i++) {
      if (typeof objSource[i] === 'object') {
        // надо понять какой объект создать и прокидывать дальше массив или объект
        objBuild[i] = Array.isArray(objSource[i]) ? [] : {}
        // вызывает рекурсивно функцию с обоими объектами
        buildObj(objSource[i], objBuild[i])

        continue
      }
      // здесь обрабатываются премитивы
      objBuild.push(objSource[i])
    }
  } else {
    for (let elem in objSource) {
      if (typeof objSource[elem] === 'object') {
        // надо понять какой объект создать и прокидывать дальше массив или объект
        objBuild[elem] = Array.isArray(objSource[elem]) ? [] : {}

        // вызывает рекурсивно функцию с обоими объектами
        buildObj(objSource[elem], objBuild[elem])

        continue
      }
      // здесь обрабатываются примитивы
      objBuild[elem] = objSource[elem]
    }
  }
}

// export default { equalObj, copyObj }
