# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

---
## Generate your custom Holochain Happ:
1. Clone the repo
    ```
    $ git clone https://github.com/holochain/RAD-Tools-Phase-2.git
    ```
2. Enter nix-shell
    ```
    $ nix-shell
    ```
3. Install root node dependencies
    ```
    $ npm i
    ```

4. Generate your custom Holochain Happ according to the type-spec.json file.
    ```
    $ npm run happ:generate <type-spec.json>
    ```
    >*NB: The type-spec.json is optional and will default to the sample-type-spec.json provided in the src/setup/type-specs folder.*

##### Type Spec JSON
    The type-spec.json file is the schema that informs the DNA zome, entry, and entry test content as well as the UI's Apollo GraphQL data layer and UI page content. 
    
    The type-spec.json is structured in a pattern wherein the keys represent the name of the current field and its values are the content of said field.
  
    ```JSON
    {
      "types": {
        <entry-name>: {
          "description": <entry-description>,
          "sharing": "<public | private>",
          "definition": {
            "<entry-field-name>": <entry-field-type>
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

### Run your custom happ:

1.  Start your Holochain Happ
    ```
    $ npm run start
    ```
---

## Run the Automated UI Command Only
### Generate a UI from type-spec
1. Generate your new ui in the `ui-src` directory.
    ```
    $ npm run ui:generate <type-spec.json>
    ```

##### Run the UI with mock data:
1. CD into that directory and run the app with mock data
    ```
    $ cd ui-src && npm i && npm start:mock
    ```

2. Navigate to your browser, where your UI server will automatically start up and open the ui in a browser tab with mock data.

---

## Run the Automated DNA Command Only
### Generate a DNA from type-spec
1. Enter nix-shell
    ```
    $ nix-shell
    ```

2. Install all root node dependencies
    ```
    $ npm i
    ```

3. Generate the DNA according to the type-spec.json file.
    ```
    $ hc:generate-dna <type-spec.json>
    ```
    >NB: *The type-spec.json is optional and will default to the sample provided in the src/setup/type-specs folder.*

    If you are only developing a DNA, you may include the zome object wrapper in your schema and run `hc-generate-dna` to generate multiple zomes. Similarly, you may declare which crud functions you'd like to generate by providing a function object as displayed below.

    The type-spec.json example with zome wrapper:

    ```JSON
    {
      "zomes": {
        <zome-name>: {
          "types": {
            <entry-name>: {
              "description": <entry-description>,
              "sharing": "<public | private>",
              "definition": {
                "<entry-field-name>": <entry-field-type>
              },
              "functions": {
                "create": <boolean>,
                "update": <boolean>,
                "delete": <boolean>,
                "get": <boolean>,
                "list": <boolean>
              }
            }
          }
        }
      }
    }
    ```
   *NB: If no zomes object is provided, a single zome will be generated. Currently, only the DNA is compatible with generating muliptle zomes.*

##### Run your DNA tests:
1. Test your DNA
    ```
    $ npm hc:test
    ```
---
