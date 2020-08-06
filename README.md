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

## Examples

[Here][pat-example] there is a good example on how to use the action.
See also the [Arduino on GitHub Actions blogpost][pat-blogpost] to learn more.

## Development

To work on the codebase you have to install all the dependencies:

```sh
# npm install
```

To run tests set the environment variable `GITHUB_TOKEN` with a valid Personal Access Token and then:

```sh
# npm run test
```

See the [official Github documentation][pat-docs] to know more about Personal Access Tokens.

## Release

1. `npm install` to add all the dependencies, included development.
2. `npm run build` to build the Action under the `./lib` folder.
3. `npm run test` to see everything works as expected.
4. `npm run pack` to package for distribution
5. `git add src dist` to check in the code that matters.
6. open a PR and request a review.

[pat-docs]: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
[pat-example]: https://github.com/arduino/arduino-cli-example/blob/master/.github/workflows/test.yaml
[pat-blogpost]: https://blog.arduino.cc/2019/11/14/arduino-on-github-actions/
