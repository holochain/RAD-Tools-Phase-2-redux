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
    >NB: *The type-spec.json is optional and will default to th sample provided in the src/setup/type-specs folder.*
    ```
    $ npm run happ:generate <type-spec.json>
    ```


### Run your custom happ:

1.  Generate your Holochain Conductor
    ```
    $ npm run hc:generate-conductor
    ```
2. Start your Holochain Happ
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

2. Navigate ot your browser, where your UI server will automatically start up and open the ui in a browser tab with mock data.

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
    >NB: *The type-spec.json is optional and will default to the sample provided in the src/setup/type-specs folder.*
    ```
    $ hc:generate-dna <type-spec.json>
    ```

##### Run your DNA tests:
1. Test your DNA
    ```
    $ npm hc:test
    ```
---

## hc-happ-scaffold: A command to generate a complete and personalized Holochain Happ
> This will generate the full UI and DNA codebase as well as the conductor interface.

## 1 - Get Holonix and enter the development environment
Holonix is a full Holochain development environment built with the [Nix package manager](https://nixos.org/nix/). 
This repo comes shipped with nix-shell already baked in.  All you need to do, is enter the provided environment, by running:
```
$ nix-shell
```
## 2 - Run the hc-happ-scaffold command
From within the `nix-shell` environment, first create a directory for all your Holochain projects (if you haven't already). You can create it wherever you like; here's a recommended setup:

```
$ cd ~
$ mkdir Holochain
$ cd Holochain
```

Then run this command:

```
$ hc-happ-scaffold <PATH_TO_JSON_TYPE_SPEC> <HAPP_PROJECT_NAME>
```

This will create a new directory for your project, download all the dependencies and development tools, and create the hApp source code.

## 3 - Start your new happ!

Once it's complete, go into the new project directory and run this command:

```
$ npm run start
```
