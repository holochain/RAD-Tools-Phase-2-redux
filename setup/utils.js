const capitalize = string => string.charAt(0).toUpperCase() + string.substring(1)
const decapitalize = string => string.charAt(0).toLowerCase() + string.substring(1)

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
  const cleanSnakeCaseString = snakeCaseString.trim()
  const hyphen = /(-)/g
  if (hyphen.test(snakeCaseString)) {
    capitalizedCleanedString = cleanSnakeCaseString.split('-').map(capitalize).join('')
    cleanSnakeCaseString = capitalizedCleanedString
  }
  const allCapitalized = cleanSnakeCaseString.split('_').map(capitalize).join('')
  const camelCase = decapitalize(allCapitalized)
  return camelCase
}

function toSnakeCase (camelCaseString) {
  const lodash = /(_)/g
  const hyphen = /(-)/g
  if (lodash.test(camelCaseString) || hyphen.test(camelCaseString)) {
    nonCamelCaseString = camelCaseString
    console.error(' Provided string is not in CamelCase.\n  Converting String to CamelCase now...')
    camelCaseString = toCamelCase(nonCamelCaseString)
    console.log('toCamelCase(nonCamelCaseString): ', camelCaseString, hyphen.test(camelCaseString), toCamelCase(nonCamelCaseString))
  }
  const cleanCamelCaseString = decapitalize(camelCaseString) // .trim()
  const capLetter = /([A-Z]+)/g
  const snakeCase = cleanCamelCaseString.replace(capLetter, (match) => '_'.concat(match.toLowerCase()))
  return snakeCase
}

function replaceNamePlaceHolders (file, placeHolderName, replacementName) {
  // placeholders
  const placeHolderAllCaps = `{${toSnakeCase(placeHolderName).toUpperCase()}}`
  const placeHolderLowerCase = `{${toSnakeCase(placeHolderName).toLowerCase()}}`
  const placeHolderCamelCase = `{${toCamelCase(placeHolderName)}}`
  const placeHolderCapitalized = `{${capitalize(placeHolderName)}}`
  // relacements
  const replacementAllCaps = toSnakeCase(replacementName).toUpperCase()
  const replacementLowerCase = toSnakeCase(replacementName).toLowerCase()
  const replacementCamelCase = toCamelCase(replacementName)
  const replacementCapitalized = capitalize(replacementName)

  return file.replace(new RegExp(placeHolderName, 'g'), replacementName)
    .replace(new RegExp(placeHolderAllCaps, 'g'), replacementAllCaps)
    .replace(new RegExp(placeHolderLowerCase, 'g'), replacementLowerCase)
    .replace(new RegExp(placeHolderCamelCase, 'g'), replacementCamelCase)
    .replace(new RegExp(placeHolderCapitalized, 'g'), replacementCapitalized)
}

function replaceContentPlaceHolders (file, placeHolderContent, replacementContent) {
  const placeHolderContentAllCaps = `{${toSnakeCase(placeHolderContent).toUpperCase()}}`
  return file.replace(new RegExp(placeHolderContentAllCaps, 'g'), replacementContent)
}

module.exports = {
  capitalize,
  mapFnOverObject,
  promiseMap,
  promiseMapFnOverObject,
  toCamelCase,
  toSnakeCase,
  replaceNamePlaceHolders,
  replaceContentPlaceHolders
}
