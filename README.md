# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

---
<!-- ## Generate your custom Holochain Happ:
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

# hc-happ-scaffold

The `hc-happ-scaffold` script is a simple dev tool that allows you to get a generate and run a personalized Holochain app as fast as possible.

Based on the JSON Type Spec provided, the script creates a holochain happ with all CRUD functions, their validtions, and .  It includes a DNA backend and a React + GraphQL frontend. It is a minimal working Holochain app.

## 0 - Install `nix-shell`

Install `nix-shell` on your machine, using this one-line command:

```
curl https://nixos.org/nix/install | sh
```

(Note: we currently support macOS and Linux only; please see our [development environment setup guide](https://developer.holochain.org/docs/install/) to set up Linux and `nix-shell` on Windows.)

## 1 - Get Holonix and enter the development environment

Holonix is a full Holochain development environment built with the [Nix package manager](https://nixos.org/nix/). 

This repo comes shipped with nix-shell already baked in.  All you need to do, is enter the provided environment, by running:
```
$ nix-shell
```

NB: Altneratively, you may also download the most recent blessed version of Holonix and enter the shell from anywhere on your OS, by running:
```
$ nix-shell https://holochain.love
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

When it's done, a browser page should open to your Happ UI. If it doesn't, you can browse to http://localhost:3400 to use the hApp.

NB: The conductor and the UI server run in the foreground, so you can stop them by pressing `Ctrl`+`C` in the terminal.

## A very brief tour

The UI code is in `ui-src` and the DNA code is in `dna-src`. Your generated happ will use:

1. A Holochain DNA on the back end (of course)
2. [Apollo GraphQL middleware](https://www.apollographql.com/) in the browser to translate zome calls into something easy for front-end frameworks to understand and manipulate
3. [React](https://reactjs.org) for UI and data flow
4. [create-react-app](https://create-react-app.dev/) for development tooling

As with most hApps, much of the business logic lives in the front-end and is delivered as static assets to the browser. The create-react-app dev tooling builds it all from source, gets it ready for the browser, and serves it up using [Webpack's dev server](https://webpack.js.org/configuration/dev-server/). (We're using this instead of Holochain's built-in static asset server because it supports live reloading of changes to the UI code.)

**Happy hacking!** -->
