function oneToManyDatum($, doc, n) {
  // key: value => db
  let keys = []
  let values = []
  let $doc = n === undefined
  ? $(doc).children('.ntable') 
  : $(doc).children('.ntable').eq(n)
  $doc.children('tbody').children('tr').each((i, v) => {
    $(v).children('th').each((j, w) => {
      keys.push($(w).text())
    })
    $(v).children('td').each((j, w) => {
      values.push($(w).text())
    })
  })
  let vl = values.length
  let kl = keys.length
  let newValues = []
  for (let i = 0; i < vl; i += kl) {
    // tr => []
    newValues.push(values.slice(i, i + kl))
  }
  let data = []
  newValues.map(v => {
    const reducer = v.reduce((result, item, index) => {
      // [] => {0: value}
      keys.map((w, j) => {
        // {0: value} => {key: value}
        if (j === index) {
          result[w] = item.trim()
        }
      })
      return result
      // => {}
    }, {})
    data.push(reducer)
  })
  return data
}

/**
 * one td to one td
 * @param {*} $ cheerio document
 * @param {*} doc fetch documentTagName
 * @returns {Object} fetch res obj
 */
function oneToOneDatum($, doc, n) {
  let keys = []
  let values = []
  let $doc = n === undefined
  ? $(doc).children('.ntable')
  : $(doc).children('.ntable').eq(n)
  $doc.children('tbody').children('tr').each((i, v) => {
    $(v).children('td').each((j, w) => {
      if (j % 2 === 0) {
        // odd => key
        keys.push($(w).text())
      } else {
        // even => value
        values.push($(w).text())
      }
    })
  })
  let obj = {}
  for (let i in keys) {
    for (let j in values) {
      if (i === j) {
        // [keys] [values] => {key1: value1, key2: value2}
        let temp = { [keys[i].trim()]: values[j].trim() }
        obj = Object.assign(obj, temp)
      }
    }
  }
  return obj
}

function shebaoDatum($, doc, n) {
  let keys = []
  let values = []
  let $doc = n === undefined
  ? $(doc).children('.ntable')
  : $(doc).children('.ntable').eq(n)
  $doc.children('tbody').children('tr').each((i, v) => {
    let td = $(v).children('td')
    if (td.length === 3) {
      td = td.filter((v, i) => i === 0)
    }
    td.each((j, w) => {
      if (j % 2 === 0) {
        // odd => key
        keys.push($(w).text())
      } else {
        // even => value
        values.push($(w).html())
      }
    })
  })

  let obj = {}
  for (let i in keys) {
    for (let j in values) {
      if (i === j) {
        // [keys] [values] => {key1: value1, key2: value2}
        let temp = { [keys[i].trim()]: values[j].trim() }
        obj = Object.assign(obj, temp)
      }
    }
  }
  return obj
}

window.oneToOneDatum = oneToOneDatum
window.oneToManyDatum = oneToManyDatum
window.shebaoDatum = shebaoDatum