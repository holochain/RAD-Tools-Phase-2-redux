# Ideas for future schema/types-def structure.

### Current Single Zome:
```JSON
{
    "types": {
        "User": {
          "description": "Create and mange notes by users.",
          "sharing": "Private", // ENUM (Private or Public)
          "definition": {
            "name": "String",
            "avatar_url": "String"
          },
          "links": [{}], // currently it's decided that they'll ONLY have the auto-generated links associated with generating a global, persistant ID for each zome.
          "anchors" : [{}], // currently it's decided that they'll automatically receive the anchors for each zome and ONLY have an anchor associated with generating a global, persistant ID.
          "functions": {} // currently it's decided that they'll automatically receive all public functions
      }
    }
 
}
```
### Full Featured Single Zome:
```JSON
{
  "types": {
    "Notes": {
      "description": "Create and mange notes by users.",
      "sharing": "Public", // ENUM (Private or Public)
      "definition": {
        "title": "String",
        "text": "String",
        "author": "String",
        "created_at": "String"
      },
      "links": [{
        "linked_entry_type": "CONSTANT: entry_name || %agent_id || anchor (imported from crate >> ie: holochain_anchors::ANCHOR_TYPE)",
        "link_type_name": "Animal",
        "link_tag_name": "Bob Cat",
        "direction": "ENUM: TO/FROM/BIDIRECTIONAL"
        }],
      "anchors" : [{
        "anchor_type_name": "notes",
        "anchor_tag_name": "animals"
      }],
      "functions": {
          "create": true,
          "update": true,
          "delete": true,
          "get": true,
          "list": true
      }
    }
  }
}
```

### Multiple Zomes:
```JSON
{
    "zomes": {
      "Profile": {
        "types": {
          "User": {
            "description": "Create and manage users.",
            "sharing": "public",
            "definition": {
              "name": "string",
              "avatar_url": "string"
            },
            "functions": {},
            "links": [{}],
            "anchors": [{}]
          }
        }
      },
      "Notes": {
        "types": {
          "Author": {
            "description": "Create and mange authors.",
            "sharing": "public",
            "definition": {
              "name": "string",
              "avatar_url": "string"
            },
            "functions": {},
            "links": [{}],
            "anchors": [{}]
          },
          "Note": {
            "description": "Create and mange notes.",
            "sharing": "public",
            "definition": {
              "title": "string",
              "content": "string",
              "author": "string"
            },
            "functions": {},
            "links": [{}],
            "anchors": [{}]
          }
        }
      }
    }
  }
```