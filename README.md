# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

## Generate a graphql schema from the sample type spec
```
$ cd ui
$ node scripts/generate-schema.js ../sample-type-spec.json
```

This will generate a `schema.gql` file in the `ui` folder, based on the type spec in `sample-type-spec.json`