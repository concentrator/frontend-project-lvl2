# Brain Games

## Project state

### Hexlet tests and linter status:
[![Actions Status](https://github.com/concentrator/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/concentrator/frontend-project-lvl2/actions)

### Maintainability

[![Maintainability](https://api.codeclimate.com/v1/badges/f3b2f347f4e2790c74c8/maintainability)](https://codeclimate.com/github/concentrator/frontend-project-lvl2/maintainability)

### Test Coverage

[![Test Coverage](https://api.codeclimate.com/v1/badges/f3b2f347f4e2790c74c8/test_coverage)](https://codeclimate.com/github/concentrator/frontend-project-lvl2/test_coverage)

## Project description

Second training project on the Hexlet Frontend Developer program. Difference Generator - command line tool that compares two configuration files and shows a difference in a human readable format.

## Requirements

To install and run this project locally __nodejs__ is required.

## Setup

### Install package

```bash
make install
```

### Create a symlink in the global node_modules and bin dirs to the project dir (to run in cli)

```bash
sudo npm link
```

## Run tests

```bash
make lint
npm test
```

## CLI usage

```bash
gendiff [options] <filepath1> <filepath2>
```

[Compare 2 nested JSON files](https://asciinema.org/a/mjHcubVPqxVAXWzHzgCxkZyDN)
