# RAD Tools Phase 2
The second tier of RAD tools, automating a UI GraphQL and DNA generation based on a JSON schema file.

---
## Run the Automated UI Command Only

### Generate a UI from type-spec
```
$ npm run generate:ui sample-type-spec.json
```

This will generate your new ui in the `ui-src` directory. CD into that directory and run

```
$ npm i && npm start
```

and your UI server will start up and open the ui in a browser tab with mock data.

---

## Run the Automated DNA Command Only

### Generate a DNA from type-spec
```
$ npm run hc-generate:dna sample-type-spec.json
```

This will generate your new DNA in the `dna-src` directory.

```
$ npm run hc:start
```

and your Holochain Conductor will start up in your terminal and output Conductor and networking logs related to the processing of data for your DNA Instance.

---

<!-- ## Generate a complete and personalized Holochain Happ
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

Holonix is a full Holochain development environment built with the [Nix package manager](https://nixos.org/nix/). Download Holonix and enter the shell:

```
$ nix-shell https://holochain.love
```

## 2 - Run the hApp scaffold command

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

## 3 - Start your new hApp!

Once it's complete, go into the new project directory and run this command:

```
$ npm run start
```

The first time the Holochain conductor runs there may be some additional compilation, so it might take a little while. When it's done, a browser page should open to the notes hApp. If it doesn't, you can browse to http://localhost:5200 to use the hApp.

The conductor and the UI server run in the foreground, so you can stop them by pressing `Ctrl`+`C`.
`$ npm start`

## A very brief tour

The UI code is in `ui_src` and the DNA code is in `dna_src`. This notes demo app uses:

1. A Holochain DNA on the back end (of course)
2. [Apollo GraphQL middleware](https://www.apollographql.com/) in the browser to translate zome calls into something easy for front-end frameworks to understand and manipulate
3. [React](https://reactjs.org) for UI and data flow
4. [create-react-app](https://create-react-app.dev/) for development tooling

As with most hApps, much of the business logic lives in the front-end and is delivered as static assets to the browser. The create-react-app dev tooling builds it all from source, gets it ready for the browser, and serves it up using [Webpack's dev server](https://webpack.js.org/configuration/dev-server/). (We're using this instead of Holochain's built-in static asset server because it supports live reloading of changes to the UI code.)

**Happy hacking!** -->
