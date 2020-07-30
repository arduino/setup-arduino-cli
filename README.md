# setup-arduino-cli

[![Actions Status](https://github.com/arduino/setup-arduino-cli/workflows/Test%20Action/badge.svg)](https://github.com/arduino/setup-arduino-cli/actions)

This action makes the `arduino-cli` tool available to Workflows.

## Usage

To get the latest stable version of `arduino-cli` just add this step:

```yaml
- name: Install Arduino CLI
  uses: arduino/setup-arduino-cli@v1.0.0
```

If you want to pin a major or minor version you can use the `.x` wildcard:

```yaml
- name: Install Arduino CLI
  uses: arduino/setup-arduino-cli@v1.0.0
  with:
    version: "0.x"
```

To pin the exact version:

```yaml
- name: Install Arduino CLI
  uses: arduino/setup-arduino-cli@v1.0.0
  with:
    version: "0.5.0"
```

## Development

To work on the codebase you have to install all the dependencies:

```sh
# npm install
```

To run the tests:

```sh
# npm run test
```

## Release

1. `npm install` to add all the dependencies, included development.
2. `npm run build` to build the Action under the `./lib` folder.
3. `npm run test` to see everything works as expected.
4. `npm run pack` to package for distribution
5. `git add src dist` to check in the code that matters.
6. open a PR and request a review.
