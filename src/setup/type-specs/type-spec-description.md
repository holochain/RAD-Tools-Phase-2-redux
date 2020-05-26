#### Type Spec JSON
The type-spec.json file is the schema that informs the DNA zome, entry, and entry test content as well as the UI's Apollo GraphQL data layer and UI page content. 
    
The type-spec.json is structured in a pattern wherein the keys represent the name of the current field and its values are the content of said field.  
```JSON
    {
      "types": {
        "<entry-name>": {
          "description": "<entry-description>",
          "sharing": "<public | private>",
          "definition": {
            "<entry-field-name>": "<entry-field-type>"
          }
        }
      }
    }
```

Example: Below is an example of a happ that will have a single zome with three entries: user, author and books:

```JSON
    {
      "types": {
        "user": {
          "description": "Create and manage users.",
          "sharing": "public",
          "definition": {
            "name": "string",
            "avatarUrl": "string"
          }
        },
        "author": {
          "description": "Create and manage authors.",
          "sharing": "public",
          "definition": {
            "user": "string",
            "nickname": "string",
          }
        },
        "book": {
          "description": "Create and manage books.",
          "sharing": "public",
          "definition": {
            "author": "string",
            "title": "string",
            "topic": "string"
          }
        }
      }
    }
```
