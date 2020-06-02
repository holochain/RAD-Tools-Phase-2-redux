const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapOverObject,
  toSnakeCase,
  toCamelCase,
  capitalize
} = require('../../setup/utils.js')
const { ENTRY_NAME, CRUD_TESTING } = require('../variables.js')

const entryTestingIndexTemplatePath = path.resolve("src/dna-setup/test-template/entry-test-template", "index.js");
const entryTestingIndexTemplate = fs.readFileSync(entryTestingIndexTemplatePath, 'utf8')

function generateEntryTest (zomeEntryName, zomeEntry, zomeName) {
  const crudTesting = renderEntryTestContent(zomeName, zomeEntry, zomeEntryName)
  const completedTestEntryFile = generateTestEntryFile(entryTestingIndexTemplate, zomeEntryName, crudTesting)
  return completedTestEntryFile
}

const renderEntryTestContent = (zomeName, zomeEntry, zomeEntryName) => {
  let { functions } = zomeEntry
  // { functions } placeholder for before type-schema format is updated :
  if (isEmpty(functions)) {
    functions = {
      create: true,
      get: true,
      update: true,
      delete: true,
      list: true
    }
  }
  const crudTesting = mapOverObject(functions, (crudFn, shouldFnRender) =>
    renderCrudTesting(crudFn, shouldFnRender, { zomeName, zomeEntryName, zomeEntry })).join('')
  return crudTesting
}

const generateTestEntryFile = (templateFile, zomeEntryName, crudTesting) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)
  newFile = replaceContentPlaceHolders(newFile, CRUD_TESTING, crudTesting)
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

  return [`${toCamelCase(entryDefName)}`, `${testValue}`]
}

const generateTestEntryArgs = (callVolume, definition, zomeEntryName) => {
  let entryArgs
  for (let id = 0; id < callVolume; id++) {
    const entryArgsMap = new Map(mapOverObject(definition, (entryDefName, entryDefType) =>
      renderEntryDefinition(entryDefName, entryDefType, { zomeEntryName, id })))
    entryArgs = Object.fromEntries(entryArgsMap)
  }
  return entryArgs
}

const rendervalidationTesting = (validatationFn, zomeEntryName, callStringBase, generateTestEntryDefault) => {
  let crudFnparams
  if(validatationFn === 'update') {
    crudFnparams = `{"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}}`
  } else {
    crudFnparams = `{"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id }`
  }
  return `
      scenario("validate_entry_${toSnakeCase(validatationFn).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}})
        await s.consistency()

        const ${toSnakeCase(validatationFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await bob.call(${callStringBase}, "${toSnakeCase(validatationFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", ${crudFnparams})
        let err = JSON.parse(${toSnakeCase(validatationFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Err.Internal)
        t.deepEqual(err.kind, {"ValidationFailed":"Agent who did not author is trying to ${toSnakeCase(validatationFn).toLowerCase()}"})
      })
  `
}

const renderCrudTesting = (crudFn, shouldFnRender, { zomeName, zomeEntryName, zomeEntry }) => {
  if (!shouldFnRender) return
  else if (crudFn === "get") return

  let crudTesting = ''

  const { definition } = zomeEntry
  const callStringBase = `'app', '${zomeName}'`
  const generateTestEntryDefault = () => generateTestEntryArgs(1, definition, zomeEntryName)
  const renderValidateEntryTest = validationCall => rendervalidationTesting(validationCall, zomeEntryName, callStringBase, generateTestEntryDefault)

  switch (crudFn) {
    case 'create': {
      const create = `
      scenario("${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await bob.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result)
      })
      `
      crudTesting = crudTesting + create
      break
    }
    case 'update': {
      const updateFn = `
      scenario("${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}})
        const ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result)

        const ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await alice.call(${callStringBase}, "${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id, "${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryDefault())}})
        await s.consistency()
        const get_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2 = await bob.call(${callStringBase}, "get_${toSnakeCase(zomeEntryName).toLowerCase()}", {"id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id})
        t.deepEqual(${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2, get_${toSnakeCase(zomeEntryName).toLowerCase()}_result_2)
      })
      `
      const validateEntryUpdate = renderValidateEntryTest(toSnakeCase(crudFn).toLowerCase())
      crudTesting = crudTesting + updateFn + validateEntryUpdate
      break
    }
    case 'delete': {
      const deleteFn = `
      scenario("${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_${toSnakeCase(zomeEntryName).toLowerCase()}_result = await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input":  ${JSON.stringify(generateTestEntryDefault())}})
        await s.consistency()
        const list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result = await bob.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result.Ok.length, 1)
        await alice.call(${callStringBase}, "${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}", { "id": create_${toSnakeCase(zomeEntryName).toLowerCase()}_result.Ok.id })
        const list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result_2 = await bob.call(${callStringBase}, "list_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(list_${toSnakeCase(zomeEntryName).toLowerCase()}s_result_2.Ok.length, 0)
      })
      `
      const validateEntryDelete = renderValidateEntryTest(toSnakeCase(crudFn).toLowerCase())
      crudTesting = crudTesting + deleteFn + validateEntryDelete
      break
    }
    case 'list': {
      const listFn = `
      scenario("${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}s", async (s, t) => {
        const {alice} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryArgs(1, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryArgs(2, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryArgs(3, definition, zomeEntryName))}})
        await alice.call(${callStringBase}, "create_${toSnakeCase(zomeEntryName).toLowerCase()}", {"${toSnakeCase(zomeEntryName).toLowerCase()}_input": ${JSON.stringify(generateTestEntryArgs(4, definition, zomeEntryName))}})
        await s.consistency()
        const result = await alice.call(${callStringBase}, "${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}s", {})
        t.deepEqual(result.Ok.length, 4)
      })
      `
      crudTesting = crudTesting + listFn
      break
    }

    default: return new Error(`Error: Found invalid CRUD function for TestEntry. CRUD fn received : ${toSnakeCase(crudFn).toLowerCase()}.`)
  }
  return crudTesting
}

module.exports = generateEntryTest
