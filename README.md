# Node.js version management with pnpm and pnpm version management with corepack

Using pnpm and corepack to manage both Node.js and pnpm versions.

## Goals

1. ensure right Node.js version is used
2. ensure right package manager & package manager version is used, ie. if we use pnpm it should disallow use of yarn/npm and the version of pnpm used should be correct

## Approach

1. `use-node-version=18.15.0` in `.npmrc` to pin the Node.js version pnpm will use when invoked
2. `preinstall` script that enables corepack
   - problem: `npm i` still works
   - [failed] `corepack enable npm yarn pnpm`, would overwrite `npm`, `yarn` and `pnpm` with symlinks/shims, this would be useful so that `npm ...` and `yarn ...` get intercepted and error with `Usage Error: This project is configured to use pnpm`
     - however it looks like this only works on second run, the first `npm i` will work fine, the second will fail with the right error, so we need to find an alternative
   - lint rule using [check-file/filename-blocklist](https://github.com/DukeLuo/eslint-plugin-check-file/blob/main/docs/rules/filename-blocklist.md) and eslint-plugin-json (in order to lint JSON files) that disallows `package-lock.json` in favour of a `pnpm-lock.yaml`
     - Rule:
       ```js
        'check-file/filename-blocklist': [
            'error',
            {
                '{,}package-lock.json': '*pnpm-lock.yaml',
            },
        ],
       ```
     - ESLint invocation: `eslint . --ext js,json`
     - Error output:
       ```sh
       1:2  error  The filename "package-lock.json" matches the blocklisted "{,}package-lock.json" pattern. Use a pattern like "*pnpm-lock.yaml" instead  check-file/filename-blocklist
       ```
