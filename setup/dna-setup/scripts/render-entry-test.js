const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase,
  toCamelCase,
  capitalize
} = require('../../utils.js')
const { ENTRY_NAME, CRUD_TESTING, VALIDATION_TESTING, DNA_NAME, INSTANCE_NAME } = require('../variables.js')

const entryTestingIndexTemplatePath = path.resolve("setup/dna-setup/test-template/entry-test-template", "index.js");
const entryTestingIndexTemplate = fs.readFileSync(entryTestingIndexTemplatePath, 'utf8')

let dnaName, instanceId, entryName
const entryTestPlaceholders = [
  [() => dnaName, DNA_NAME],
  [() => instanceId, INSTANCE_NAME],
  [() => entryName, ENTRY_NAME]
]

let crudTesting, validationTesting
const entryTestContent = [
  [() => crudTesting, CRUD_TESTING],
  [() => validationTesting, VALIDATION_TESTING]
]

function renderEntryTest (zomeEntryName, zomeEntry, dna = 'DNA') {
  console.log(` >>> rendering file ${zomeEntryName} Entry Test - index.js `)

  dnaName = dna
  instanceId = `${dna}HappInstance`

  const { crudTesting, validationTesting } = renderEntryTestContent(zomeEntry, zomeEntryName)
  const completedTestEntryFile = renderTestEntryFile(entryTestingIndexTemplate, zomeEntryName, crudTesting, validationTesting)
  return completedTestEntryFile
}

const renderEntryTestContent = (zomeEntry, zomeEntryName) => {
  let { functions } = zomeEntry
  // { functions } placeholder for before type-schema format is updated :
  if(isEmpty(functions)) {
    functions = {
      "create": true,
      "get": true,
      "update": true,
      "remove": true,
      "list": true
    }
  }
  crudTesting = mapFnOverObject(functions, renderCrudTesting, { zomeEntryName, zomeEntry }).join('')
  console.log(' >>> crudTesting', crudTesting)
  
  validationTesting = [] //mapFnOverObject(functions, renderCrudTesting, { zomeEntryName, zomeEntry }).join('')
  console.log(' >>> validationTesting', validationTesting)
  return { crudTesting, validationTesting }
}

const renderTestEntryFile = templateFile => {  
  console.log(`========== Entry TEST =========== \n`)
  let newFile = templateFile

  entryTestPlaceholders.forEach(([zomeEntryContent, placeHolderContent]) => {
    newFile = replaceNamePlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  entryTestContent.forEach(([zomeEntryContent, placeHolderContent]) => {
    newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  return newFile
}

const renderEntryDefinition = (entryDefName, entryDefType, { zomeEntryName, id }) => {
  console.log('')

  const testValue = typeof entryDefType === 'string'
    ? `${capitalize(zomeEntryName.toLowerCase())} test content for the ${entryDefName.toLowerCase()} feild in entry definition. No ${id}`
    : typeof entryDefType === 'number'
      ? id
      : typeof entryDefType === 'function'
        ? `() => ${capitalize(zomeEntryName.toLowerCase())} test content for the ${entryDefName.toLowerCase()} feild in entry definition. No ${id}`
        : console.error(`Received unexpected value type for ${capitalize(zomeEntryName.toLowerCase())} entry, field ${entryDefName.toLowerCase()}`)

  return `[${entryDefName}, ${testValue}]`
}

const genEntryArgs = (callVolume, definition, zomeEntryName) => {
  if(isEmpty(definition)) {
    const entryDefinitionFields =  { ...zomeEntry, description, sharing }
    definition = { entryDefinitionFields }
  }

  let entryArgs
  for (let i = 0; i < callVolume; i++) {
    const entryArgsMap = mapFnOverObject(definition, renderEntryDefinition, { zomeEntryName, i }).join('')
    console.log('entryArgArray, {zomeEntryName, i}: ', entryArgArray, JSON.stringify({ zomeEntryName, i }))
    entryArgs = Object.fromEntries(entryArgsMap);
  }
  
  console.log('entryArgs: ', entryArgs)
  return entryArgs
}


const renderCrudTesting = (crudFn, shouldFnRender, { zomeEntryName, zomeEntry }) => {
  if (!shouldFnRender) return
  else if (crudFn === "get") return

  const { definition } = zomeEntry
  const callStringBase = `'${dnaName}', '${instanceId}'`

  let crudTestEntryDef = ''
  switch (crudFn) {
    case 'create': {
      const create = `
      scenario("create_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {ARGS}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await bob.call(${callStringBase}, get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(create_note_result, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result)
      })
      `
      crudTestEntryDef = crudTestEntryDef + create
      break
    }
    case 'update': {
      const update = `
      scenario("update_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {ARGS}})
        const update_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, update_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {ARGS}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(update_${toSnakeCase(zomeEntryName).toLowerCase()}_result, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result)
  
        const update_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await alice.call(${callStringBase}, update_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {ARGS}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await bob.call(${callStringBase}, get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(update_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2)
      })
      `
      crudTestEntryDef = crudTestEntryDef + update
      break
    }
    case 'remove': {
      const remove = `
      scenario("remove_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"note_input" : {"title":"Title first note", "content":"Content first note"}})
        await s.consistency()
        const list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result = await bob.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result.Ok.length, 1)
        const remove_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "remove_${toSnakeCase(zomeEntryName).toLowerCase()}", { "id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id })
        const list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result_2 = await bob.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result_2.Ok.length, 0)
      })  
      `
      crudTestEntryDef = crudTestEntryDef + remove
      break
    }
    case 'list': {
      const list = `
      scenario("list_${toSnakeCase(zomeEntryName).toLowerCase()}s", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {${genEntryArgs(1, definition)}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {${genEntryArgs(2, definition)}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {${genEntryArgs(3, definition)}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : {${genEntryArgs(4, definition)}})
        await s.consistency(
       const result = await alice.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(result.Ok.length, 4)
      })
      `
      crudTestEntryDef = crudTestEntryDef + list
      break
    }

    default: return new Error(`Error: Found invalid CRUD function for TestEntry. CRUD fn received : ${crudFn}.`)
  }

  return crudTestEntryDef
}

module.exports = renderEntryTest
