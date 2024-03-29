import path from 'node:path'
import fs from 'fs-extra'
import { updatePackageJSON } from './utils/updatePackageJson'
import { PATHS } from './.internal/constants';
import { version } from '../package.json'

const packages = [
  'toggle-selection',
  'copy-to-clipboard',
]

async function buildMetaFiles() {
  for (const name of packages) {
    const packageRoot = path.resolve(PATHS.PACKAGES, name)

    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))

    for (const key of Object.keys(packageJSON.dependencies || {})) {
      if (key.startsWith('@pansy/'))
        packageJSON.dependencies[key] = version
    }
    await fs.writeJSON(path.join(packageRoot, 'package.json'), packageJSON, { spaces: 2 })
  }
}

(async function run() {
  await Promise.all([
    updatePackageJSON(),
  ])

  buildMetaFiles()
})()
