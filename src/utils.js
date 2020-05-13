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

function insertSpacesInString (string, spaceDelimiter) {
  const capLetter = /([A-Z]+)/g
  const hyphen = /(-)/g
  const underscore = /(_)/g

  let delimiter
  switch (spaceDelimiter) {
    case 'capLetter': {
      delimiter = capLetter
      break
    }
    case 'hyphen': {
      delimiter = hyphen
      break
    }
    case 'underscore': {
      delimiter = underscore
      break
    }
    default: return new Error(`Error: Did not receive known space delimiter, found instead :  ${spaceDelimiter}.`)
  }

  if (delimiter.test(string)) {
   return string.replace(space, match => ' '.concat(match.toLowerCase()))
  } else {
    console.log(`Notice: There are no ${spaceDelimiter}s to replace in provided string,`, string)
    return string
  }
}

function replaceSpacesInString (string, replacement) {
  const space = /( )/g
  if (space.test(string)) {
   return string.replace(space, match => replacement.concat(match.toLowerCase()))
  } else {
    console.log('Notice: There are no spaces to replace in provided string.')
    return string
  }
}

function testForSpaces (string) {
  const space = /( )/g
  if (space.test(string)) return true
  else return false
}

function toKebabCase (snakeCaseString) {
  const capLetter = /([A-Z]+)/g
  if (testForSpaces(snakeCaseString)) {
    snakeCaseString = replaceSpacesInString(snakeCaseString, '_')
  }
  if (capLetter.test(snakeCaseString)) {
    const nonSnakeCaseString = snakeCaseString
    console.error(`\nProvided string is not in snake_case: ${nonSnakeCaseString}`)
    snakeCaseString = toSnakeCase(nonSnakeCaseString)
    console.log(`Converted String to snake_case : ${snakeCaseString}\n`)
  }
  let cleanSnakeCaseString = snakeCaseString.trim().toLowerCase()
  const underscore = /(_)/g
  const snakeCase = cleanSnakeCaseString.replace(underscore, match => '-'.concat(match.toLowerCase()))
  return snakeCase
}

function toCamelCase (snakeCaseString) {
  let cleanSnakeCaseString = snakeCaseString.trim().toLowerCase()
  const hyphen = /(-)/g
  if (testForSpaces(snakeCaseString)) {
    snakeCaseString = replaceSpacesInString(snakeCaseString, '-')
  }
  if (hyphen.test(cleanSnakeCaseString)) {
    const capitalizedCleanedString = cleanSnakeCaseString.split('-').map(capitalize).join('')
    cleanSnakeCaseString = capitalizedCleanedString
  }
  const allCapitalized = cleanSnakeCaseString.split('_').map(capitalize).join('')
  const camelCase = decapitalize(allCapitalized)
  return camelCase
}

function toSnakeCase (camelCaseString) {
  const cleanCamelCaseString = decapitalize(camelCaseString).trim()
  const underscore = /(_)/g
  const hyphen = /(-)/g
  if (testForSpaces(camelCaseString)) {
    snakeCaseString = replaceSpacesInString(camelCaseString, '_')
  }
  if (underscore.test(cleanCamelCaseString) || hyphen.test(cleanCamelCaseString)) {
    const nonCamelCaseString = cleanCamelCaseString
    console.error(`\nProvided string is not in camelCase: ${nonCamelCaseString}`)
    camelCaseString = toCamelCase(nonCamelCaseString)
    console.log(`Converted String to camelCase : ${camelCaseString}\n`)
  }
  const capLetter = /([A-Z]+)/g
  const snakeCase = cleanCamelCaseString.replace(capLetter, match => '_'.concat(match.toLowerCase()))
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
  insertSpacesInString,
  replaceSpacesInString,
  toKebabCase,
  toCamelCase,
  toSnakeCase,
  replaceNamePlaceHolders,
  replaceContentPlaceHolders
}
