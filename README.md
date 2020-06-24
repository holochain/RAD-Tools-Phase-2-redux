# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

---
## Tutorial: Generate your custom Holochain hApp

### Two ways to use this tool

You can get and use this tool either by:

1. cloning this repo and using `npm` commands, or
2. using [Holonix](https://github.com/holochain/holonix), the Holochain development environment, which includes a single-line command.

The first option is more versatile -- for instance, you can generate UI and DNA separately. The second option is simpler to use. From now on we'll call option 1 'Repo' and option 2 'Holonix'.

### 1. Getting the tool

We'll assume you already have the Nix package manager, which we're using to distribute Holochain developer tools. If you're on macOS, Linux, or Windows 10, follow our [installation guide](https://developer.holochain.org/docs/install/).

* **Repo**

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

* **Holonix**

    1. Enter the Holochain development environment.
        ```
        $ nix-shell https://holochain.love
        ```

### 2. Create a Type Spec JSON file

The type-spec.json file is the schema that informs the DNA zome, entry, and entry test content as well as the UI's Apollo GraphQL data layer and UI page content. It consists of a single JSON object, `"types"`, which contains objects for each of the types of entry that your hApp should create.

Within each named entry type, there are three properties:

* `"description"`: A human-readable description of what this entry type is for.
* `"sharing"`: Whether entries of this type should be `"public"` (shared on the DHT) or `"private"` (kept in the authoring agent's source chain only).
* `"definition"`: A list of the fields for this entry type, along with the field types. These types can be any [Rust type](https://doc.rust-lang.org/reference/types.html) that can be automatically serialized to JSON.

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

Below is an example of a hApp that will have a single zome with three entries: user, author and book. If you're just trying the tool and don't want to create a schema yet, you can copy this into a file on your computer.

```JSON
    {
      "types": {
        "user": {
          "description": "Create and manage users.",
          "sharing": "public",
          "definition": {
            "name": "string",
            "avatar_url": "string"
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

### 3. Generate your custom Holochain hApp according to the type-spec.json file

* **Repo**
    ```
    $ npm run hApp:generate <type-spec.json>
    ```
    > *NB: The type-spec.json is optional and will default to the sample-type-spec.json provided in the src/setup/type-specs folder.*

* **Holonix**
    ```
    $ hc-happ-scaffold <type-spec.json> <new-project-folder>
    ```
    This command accepts local file paths or URLs for the type-spec.json file, and creates the folder specified by `<new-project-folder>` for you.

The source code is scaffolded immediately, but it'll take a while to compile the DNA initially.

### 4. Run your custom hApp

* **Repo**
    1.  Start your Holochain hApp.
        ```
        $ npm run start
        ```

* **Holonix**
    1. Switch to your new project's folder.
        ```
        $ cd <new-project-folder>
        ```
    2. Start your Holochain hApp.
        ```
        $ npm start
        ```

---

## Run the Automated UI Command Only

This feature is currently only available directly through this repo, not the Holonix command.

### Generate a UI from type-spec
1. Generate your new ui in the `ui-src` directory.
    ```
    $ npm run ui:generate <type-spec.json>
    ```

### Run the UI with mock data:
1. CD into that directory and run the app with mock data
    ```
    $ cd ui-src && npm i && npm start:mock
    ```

2. Navigate to your browser, where your UI server will automatically start up and open the ui in a browser tab with mock data.

---

## Run the Automated DNA Command Only

This feature is currently only available directly through this repo, not the Holonix command.

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

    If you are only developing a DNA, you may include the `"zomes"` object wrapper in your schema and run `hc-generate-dna` to generate multiple zomes. Similarly, you may declare which CRUD functions you'd like to generate by providing a function object as displayed below.

    The type-spec.json example with zome wrapper:

    ```JSON
    {
      "zomes": {
        "<zome-name>": {
          "types": {
            "<entry-name>": {
              "description": "<entry-description>",
              "sharing": "<public | private>",
              "definition": {
                "<entry-field-name>": "<entry-field-type>"
              },
              "functions": {
                "create": "<boolean>",
                "update": "<boolean>",
                "delete": "<boolean>",
                "get": "<boolean>",
                "list": "<boolean>"
              }
            }
          }
        }
      }
    }
    ```
   *NB: If no `"zomes"` object is provided, a single zome will be generated. Currently, only the DNA is compatible with multiple zomes input from the Type Spec JSON.*

### Run your DNA tests:
1. Test your DNA
    ```
    $ npm hc:test
    ```
---
