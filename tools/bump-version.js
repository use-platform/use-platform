#!/usr/bin/env node

const semver = require('semver')
const fs = require('fs')
const path = require('path')

const pkg = require('../package.json')
const pkgLock = require('../package-lock.json')

const version = semver.inc(pkg.version, 'prerelease')

Object.assign(pkg, { version })
Object.assign(pkgLock, { version })

fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, null, 2) + '\n')
fs.writeFileSync(
  path.resolve(__dirname, '../package-lock.json'),
  JSON.stringify(pkgLock, null, 2) + '\n',
)
