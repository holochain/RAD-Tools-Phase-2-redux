# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

## Generate a UI from type-spec
```
$ yarn generate:ui sample-type-spec.json
```

This will generate a `generated_ui` directory in the `ui` directory. CD into that directory and run

```
$ yarn install && yarn start
```

and your UI server will start up and open the ui in a browser tab.
