const capitalize = string => string.charAt(0).toUpperCase() + string.substring(1)
const decapitalize = string => string.charAt(0).toLowerCase() + string.substring(1)

function createObjectMap (object) {
  return Object.keys(object).sort().map(key => ({ [key]: object[key] }))
}

function mapFnOverObject (object, fn, args = {}) {
  return Object.keys(object).sort().map(key => fn(key, object[key], args))
}

async function promiseMap (array, fn) {
  const resolvedArray = await array
  const promiseArray = resolvedArray.map(fn)
  const resolved = await Promise.all(promiseArray)
  return resolved
}

function promiseMapFnOverObject (object, fn, args = {}) {
  return promiseMap(Object.keys(object).sort(), key => fn(key, object[key], args))
}

function toCamelCase (snakeCaseString) {
  const cleanSnakeCaseString = snakeCaseString.trim().split('-').join('')
  const allUpperCase = cleanSnakeCaseString.split('_').map(capitalize).join('')
  const camelCase = decapitalize(allUpperCase)
  return camelCase
}

function toSnakeCase (camelCaseString) {
  const lodash = /(_)/g
  const hyphen = /(-)/g
  if (lodash.test(camelCaseString) || hyphen.test(camelCaseString)) {
    nonCamelCaseString = camelCaseString
    console.error(' Provided string is not in CamelCase.\n  Converting String to CamelCase now...')
    camelCaseString = toCamelCase(nonCamelCaseString)
  }
  const cleanCamelCaseString = decapitalize(camelCaseString).trim()
  const capLetter = /([A-Z]+)/g
  const snakeCase = cleanCamelCaseString.replace(capLetter, (match) => '_'.concat(match.toLowerCase()))
  return snakeCase
}


function replaceNamePlaceHolders (file, placeHolderName, replacementName) {
  const placeHolderAllCaps = `{${placeHolderName.toUpperCase()}}`
  const placeHoldercapitalized = `{${placeHolderName.charAt(0).toUpperCase() + placeHolderName.substring(1)}}`
  const replacementAllCaps = replacementName.toUpperCase()
  const replacementCapitalized = replacementName.charAt(0).toUpperCase() + replacementName.substring(1)
  return file.replace(new RegExp(placeHolderName, 'g'), replacementName).replace(new RegExp(placeHolderAllCaps, 'g'), replacementAllCaps).replace(new RegExp(placeHolderCapitalized, 'g'), replacementCapitalized)
}

function replaceContentPlaceHolders (file, placeHolderContent, replacementContent) {
  const placeHolderContentAllCaps = `{${toSnakeCase(placeHolderContent).toUpperCase()}}`
  return file.replace(new RegExp(placeHolderContentAllCaps, 'g'), replacementContent)
}

module.exports = {
  capitalize,
  createObjectMap,
  mapFnOverObject,
  promiseMap,
  promiseMapFnOverObject,
  toCamelCase,
  toSnakeCase,
  replaceNamePlaceHolders,
  replaceContentPlaceHolders
}

/////
  // const mapFnOverObject = (object, fn) => Object.keys(object).sort().map(key => fn(key, object[key]))
  // const renderField = (key, value) => {
  //     console.log(`${key}: ${value}`)
  // }
  // mapFnOverObject(object, renderField).join('\n')
  // // vs:
  // for (let [key, value] of Object.entries(object)) {
  //     console.log(`${key}: ${value}`).concat('\n')
  // }
 /////