const capitalize = string => string.charAt(0).toUpperCase() + string.substring(1)

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

function replaceNamePlaceHolders (file, placeHolderName, replacementName) {
  const placeHolderAllCaps = `{${placeHolderName.toUpperCase()}}`
  const placeHoldercapitalized = `{${placeHolderName.charAt(0).toUpperCase() + placeHolderName.substring(1)}}`
  ////
  // todo : snake_case
  ////
  const replacementAllCaps = replacementName.toUpperCase()
  const replacementCapitalized = replacementName.charAt(0).toUpperCase() + replacementName.substring(1)
  return file.replace(new RegExp(placeHolderName, 'g'), replacementName).replace(new RegExp(placeHolderAllCaps, 'g'), replacementAllCaps).replace(new RegExp(placeHolderCapitalized, 'g'), replacementCapitalized)
}

function replaceContentPlaceHolders (file, placeHolderContent, replacementContent) {
  const placeHolderContentAllCaps = `let ${placeHolderContent.toUpperCase()}`
  const newFile =  file.replace(new RegExp(placeHolderContentAllCaps, 'g'), replacementContent)
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n ${newFile} \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
  return newFile
}

module.exports = {
  capitalize,
  createObjectMap,
  mapFnOverObject,
  promiseMap,
  promiseMapFnOverObject,
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