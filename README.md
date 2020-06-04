[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ryr.svg)](https://npmjs.org/package/ryr)
[![Downloads/week](https://img.shields.io/npm/dw/ryr.svg)](https://npmjs.org/package/ryr)
[![License](https://img.shields.io/npm/l/ryr.svg)](https://github.com/nao50/ryr/blob/master/package.json)

# ryr

Resolving yaml refs CLI tool.

# Caution

This tool is still under development, so please use it as an alpha version.  
So I won't be uploading it to npm and such for now.

# Usage

```sh-session
$ git clone https://github.com/nao50/ryr.git && cd ryr
$ npm install
$ npm link
```

# Commands

```sh-session
$ ryr --help

USAGE
  $ ryr INPUTFILE

ARGUMENTS
  INPUTFILE  The YAML file you're trying to solve

OPTIONS
  -h, --help             show CLI help
  -v, --version          show CLI version
  -o, --outputFile       [default: resolved] output file name
  -f, --outputFormat     output file format

$ ryr ./example/index.yaml --outputFormat yaml
openapi: 3.0.0
info:
  version: 0.0.0
  title: Example YAML file
paths:
  /path1:
    get:
      responses:
        '200':
          description: OK
          schema:
            type: object
            properties:
              name:
                type: string
  /path2:
    get:
      responses:
        '200':
          description: OK
          schema:
            type: object
            properties:
              name:
                type: string
```

# Dependencies

https://github.com/oclif/oclif
https://github.com/nodeca/js-yaml
https://github.com/whitlockjc/json-refs
