const capitalize = string => string.charAt(0).toUpperCase() + string.substring(1)
const decapitalize = string => string.charAt(0).toLowerCase() + string.substring(1)

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
    return string
  }
}

function replaceSpacesInString (string, replacement) {
  const space = /( )/g
  if (space.test(string)) {
    return string.replace(space, match => replacement.concat(match.toLowerCase()))
  } else {
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
  const cleanSnakeCaseString = snakeCaseString.trim().toLowerCase()
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
    camelCaseString = replaceSpacesInString(camelCaseString, '_')
  }
  if (underscore.test(cleanCamelCaseString) || hyphen.test(cleanCamelCaseString)) {
    const nonCamelCaseString = cleanCamelCaseString
    camelCaseString = toCamelCase(nonCamelCaseString)
  }
  const capLetter = /([A-Z]+)/g
  const snakeCase = cleanCamelCaseString.replace(capLetter, match => '_'.concat(match.toLowerCase()))
  return snakeCase
}

module.exports = {
  capitalize,
  insertSpacesInString,
  toKebabCase,
  toSnakeCase
}
