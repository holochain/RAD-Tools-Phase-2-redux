const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase,
  capitalize
} = require('../../utils.js')
const { ENTRY_NAME, CRUD_TESTING, VALIDATION_TESTING } = require('../variables.js')

const entryTestingIndexTemplatePath = path.resolve("setup/dna-setup/test-template/entry-test-template", "index.js");
const entryTestingIndexTemplate = fs.readFileSync(entryTestingIndexTemplatePath, 'utf8')

let crudTesting, validationTesting
const entryTestContent = [
  [() => crudTesting, CRUD_TESTING],
  [() => validationTesting, VALIDATION_TESTING]
]

function renderEntryTest (zomeEntryName, zomeEntry) {
  renderEntryTestContent(zomeEntry, zomeEntryName)
  const completedTestEntryFile = renderTestEntryFile(entryTestingIndexTemplate, zomeEntryName)
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
  
  validationTesting = [] //mapFnOverObject(functions, rendervalidationTesting, { zomeEntryName, zomeEntry }).join('')
  console.log(' >>> validationTesting', validationTesting)
  return { crudTesting, validationTesting }
}

const renderTestEntryFile = (templateFile, zomeEntryName) => {  
  console.log(`------- Entry TEST------- \n`)
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)
  entryTestContent.forEach(([zomeEntryContentFn, placeHolderContent]) => {
    newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContentFn())
  })
  return newFile
}

const renderEntryDefinition = (entryDefName, entryDefType, { zomeEntryName, id }) => {
  const testId = id + 1
  const testValue = typeof entryDefType === 'string'
    ? `${capitalize(zomeEntryName.toLowerCase())} test entry #${testId} content for the ${entryDefName.toLowerCase()} field in entry definition.`
    : typeof entryDefType === 'number'
      ? id
      : typeof entryDefType === 'function'
        ? `() => ${capitalize(zomeEntryName.toLowerCase())} test entry #${testId} content for the ${entryDefName.toLowerCase()} field in entry definition.`
        : console.error(`Received unexpected value type for ${capitalize(zomeEntryName.toLowerCase())} entry, field ${entryDefName.toLowerCase()}`)

  return [`${entryDefName}`, `${testValue}`]
}

const generateTestEntryArgs = (callVolume, definition, zomeEntryName) => {
  if(isEmpty(definition)) {
    const entryDefinitionFields =  { ...zomeEntry, description, sharing }
    definition = { entryDefinitionFields }
  }
  let entryArgs
  for (let id = 0; id < callVolume; id++) {
    const entryArgsMap = new Map(mapFnOverObject(definition, renderEntryDefinition, { zomeEntryName, id }))
    entryArgs = Object.fromEntries(entryArgsMap);
  }
  return entryArgs
}

const renderCrudTesting = (crudFn, shouldFnRender, { zomeEntryName, zomeEntry }) => {
  if (!shouldFnRender) return
  else if (crudFn === "get") return

  const { definition } = zomeEntry
  const callStringBase = 'DNA, DnaHappInstance'

  let crudTestEntryDef = ''
  switch (crudFn) {
    case 'create': {
      const create = `
      scenario("create_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(4, definition, zomeEntryName))}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await bob.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
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
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        const update_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "update_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(update_${toSnakeCase(zomeEntryName).toLowerCase()}_result, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result)
  
        const update_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await alice.call(${callStringBase}, "update_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await bob.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
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
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" :  ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        await s.consistency()
        const list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result = await bob.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result.Ok.length, 1)
        await alice.call(${callStringBase}, "remove_${toSnakeCase(zomeEntryName).toLowerCase()}", { "id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id })
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
        const {alice} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(2, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(3, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input" : ${JSON.stringify(generateTestEntryArgs(4, definition, zomeEntryName))}})
        await s.consistency()
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
