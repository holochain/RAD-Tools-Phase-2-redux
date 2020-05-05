function mapObject (object, fn) {
  return Object.keys(object).sort().map(key => fn(key, object[key]))
}

module.exports = {
  mapObject
}
