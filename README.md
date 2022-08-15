# Brain Games

## Project state

### Hexlet tests and linter status:
[![Actions Status](https://github.com/concentrator/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/concentrator/frontend-project-lvl2/actions)

### Maintainability

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
