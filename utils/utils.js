String.prototype.trim = function () {
  return this.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "")
}
/**
 * cookies string => {name: '', value: ''}
 * @param {String} cookies
 * @returns {String} cookies
 */
export const formatCookies = cookies => {
  cookies = cookies.split(';')
  const cookiesTemp = []
  let names = []
  let values = []
  cookies.map((v, i) => {
    const newMap = v.split('=')
    newMap.map((w, j) => {
      if (j % 2 === 0) {
        names.push(w.trim())
      } else {
        values.push(w.trim())
      }
    })
  })
  names.map((v, i) => {
    cookiesTemp.push({name: v, value: values[i]})
  })
  return cookiesTemp
}

/**
 * cookies object => {name: '', value: ''}
 * @param {String} cookies
 */
export const transformCookies = cookies => {
  let keys = []
  keys = Object.keys(cookies[0]).filter(item => item !== 'name' && item !== 'value')
  keys.forEach((v, i) => {
    cookies.forEach((w, j) => {
      delete cookies[j][v]
    })
  })
}