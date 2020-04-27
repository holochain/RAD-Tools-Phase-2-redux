const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders, mapFnOverObject, capitalize } = require('../../utils.js')
const { ENTRY_IMPORTS, ENTRY_DEFINITIONS, ENTRY_FUNCTION_DEFINITIONS } = require('../variables/index')
const zomeIndexTemplatePath = path.resolve("setup/dna-setup/zome-template", "index.rs");
const zomeIndexTemplate = fs.readFileSync(zomeIndexTemplatePath, 'utf8')

function renderZomeIndex (zomeName, zomeEntryTypes) {
    console.log(` >>> rendering file ${zomeName}/index.rs, zomeEntryTypes : `, zomeEntryTypes)
    const completedZomeIndex = mapFnOverObject(zomeEntryTypes, renderIndex).join('\n')
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AFTERWARD: \n ${completedZomeIndex} \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
    // fs.writeFileSync(resolvePath(filename), completedZomeIndex)
    return `# NB: ${zomeName}/index.rs: \n ## Zome Entries: ${JSON.stringify(zomeEntryTypes)} \n`
}

const renderIndex = (zomeEntryType, zomeEntry) => {
  const zomeIndexContents = [
    [renderZomeEntryImports(zomeEntryType), ENTRY_IMPORTS],
    [renderZomeEntryDefs(zomeEntryType), ENTRY_DEFINITIONS],
    [renderZomeEntryFns(zomeEntryType, zomeEntry), ENTRY_FUNCTION_DEFINITIONS]
  ]

  let newFile = zomeIndexTemplate
  zomeIndexContents.forEach(([zomeEntryContent, placeHolderContent]) => {
    newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })
  return newFile
}


const renderZomeEntryImports = zomeEntryType => {
  console.log('creating renderZomeEntryImports def for : ', zomeEntryType)
  return `use crate::${zomeEntryType.toLowerCase()}::${capitalize(zomeEntryType)}Entry;
  use crate::${zomeEntryType.toLowerCase()}::${capitalize(zomeEntryType)};
  pub mod ${zomeEntryType.toLowerCase()};
  `
}

const renderZomeEntryDefs = zomeEntryType => {
  console.log('creating zomeEntryType def for : ', zomeEntryType)
  return `#[entry_def]
  fn ${zomeEntryType.toLowerCase()}_def() -> ValidatingEntryType {
    ${zomeEntryType.toLowerCase()}::definition()
  }
  `
}

const renderZomeEntryFns = (zomeEntryType, { functions }) => {
  console.log('creating zomeEntry Function defs for : ', zomeEntryType)
  return mapFnOverObject(functions, renderFnDef, zomeEntryType)

  // return `#[zome_fn("hc_public")]
  // fn create_${zomeEntryType.toLowerCase()}(${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry) -> ZomeApiResult<${capitalize(zomeEntryType)}> {
  //     ${zomeEntryType.toLowerCase()}::handlers::create_${zomeEntryType.toLowerCase()}(${zomeEntryType.toLowerCase()}_input)
  // }

  // #[zome_fn("hc_public")]
  // fn get_${zomeEntryType.toLowerCase()}(id: Address) -> ZomeApiResult<${capitalize(zomeEntryType)}> {
  //     ${zomeEntryType.toLowerCase()}::handlers::get_${zomeEntryType.toLowerCase()}(id)
  // }

  // #[zome_fn("hc_public")]
  // fn update_${zomeEntryType.toLowerCase()}(id: Address, ${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry) -> ZomeApiResult<${capitalize(zomeEntryType)}> {
  //     ${zomeEntryType.toLowerCase()}::handlers::update_${zomeEntryType.toLowerCase()}(id, ${zomeEntryType.toLowerCase()}_input)
  // }

  // #[zome_fn("hc_public")]
  // fn remove_${zomeEntryType.toLowerCase()}(id: Address) -> ZomeApiResult<${capitalize(zomeEntryType)}> {
  //     ${zomeEntryType.toLowerCase()}::handlers::remove_${zomeEntryType.toLowerCase()}(id)
  // }

  // #[zome_fn("hc_public")]
  // fn list_${zomeEntryType.toLowerCase()}() -> ZomeApiResult<${capitalize(zomeEntryType)}> {
  //     ${zomeEntryType.toLowerCase()}::handlers::list_${zomeEntryType.toLowerCase()}()
  // }
  // `
}


const renderFnDef = (crudFn, shouldFnRender, zomeEntryType) => {
  if (!shouldFnRender) return
  let args
  switch (crudFn) {
    case 'create': {
      args = `(${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      break
    }
    case 'get': {
      args = `(id: Address)`
      break
    }
    case 'update': {
      args = `(id: Address, ${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      break
    }
    case 'remove': {
      args =  `{id: Address}`
      break    
    }
    case 'list': {
      args = '()'
      break
    }
    default: return new Error(`Error: No CRUD function matched. CRUD fn received : ${crudFn}.`)
  }

  return `#[zome_fn("hc_public")]
  fn ${crudFn}_${zomeEntryType.toLowerCase()}${args} -> ZomeApiResult<${capitalize(zomeEntryType)}> {
      ${zomeEntryType.toLowerCase()}::handlers::${crudFn}_${zomeEntryType.toLowerCase()}(${zomeEntryType.toLowerCase()}_input)
  }
  `
}

module.exports = renderZomeIndex
