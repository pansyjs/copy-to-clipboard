import { join } from 'node:path'
import fs from 'fs-extra'
import { PATHS } from '../.internal/constants';

const packages = [
  'toggle-selection',
  'copy-to-clipboard',
]

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')

  for (const pkgName of packages) {
    const packageDir = join(PATHS.PACKAGES, pkgName)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}
