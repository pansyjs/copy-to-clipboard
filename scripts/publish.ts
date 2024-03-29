import { execSync } from 'node:child_process'
import path from 'node:path'
import { consola } from 'consola'
import { version } from '../package.json'

execSync('npm run build', { stdio: 'inherit' })

const packages = [
  'toggle-selection',
  'copy-to-clipboard',
]

let command = 'npm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'

for (const name of packages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @pansy/${name}`)
}
