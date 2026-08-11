const { spawn, execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const Args = process.argv.slice(2)
const SKIP_BUILD = Args.includes('--skip-build')
const BUILD_ONLY = Args.includes('--build-only')

const ESC = String.fromCharCode(27)

function step(msg) {
  console.log(ESC + '[1m' + ESC + '[33m▶ ' + msg + ESC + '[0m')
}

function run(cmd, label) {
  try { execSync(cmd, { cwd: ROOT, stdio: 'inherit' }) }
  catch (err) { console.error(ESC + '[31mERROR:' + ESC + '[0m', label || cmd, err.message); process.exit(1) }
}

// Fix nested HTML path from Vite build
function fixDist() {
  const nested = path.join(ROOT, 'dist', 'renderer', 'src', 'renderer', 'index.html')
  const final  = path.join(ROOT, 'dist', 'renderer', 'index.html')
  if (fs.existsSync(nested)) {
    let html = fs.readFileSync(nested, 'utf8')
    html = html.replace(/\.\.\/\.\.\/assets\//g, './assets/')
    fs.writeFileSync(final, html, 'utf8')
    const srcDir = path.join(ROOT, 'dist', 'renderer', 'src')
    if (fs.existsSync(srcDir)) fs.rmSync(srcDir, { recursive: true, force: true })
  }
}

// Copy manifest.json from source plugins/ to dist/plugins/
function copyManifests() {
  const srcDir = path.join(ROOT, 'plugins')
  const dstDir = path.join(ROOT, 'dist', 'plugins')
  if (!fs.existsSync(srcDir)) return
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const srcManifest = path.join(srcDir, entry.name, 'manifest.json')
    const dstManifest = path.join(dstDir, entry.name, 'manifest.json')
    if (fs.existsSync(srcManifest) && !fs.existsSync(dstManifest)) {
      fs.copyFileSync(srcManifest, dstManifest)
      console.log('Copied manifest:', entry.name)
    }
  }
}

step('HakiWork v1.0.0')

if (BUILD_ONLY) {
  step('Compile main process')
  run('npx tsc -p tsconfig.main.json')
  run('npx tsc-alias -p tsconfig.main.json')
  step('Compile renderer')
  run('npx vite build --mode renderer')
  fixDist()
  copyManifests()
  console.log(ESC + '[32m✓ Build complete' + ESC + '[0m')
  process.exit(0)
}

if (!SKIP_BUILD) {
  step('Compile main process')
  run('npx tsc -p tsconfig.main.json')
  run('npx tsc-alias -p tsconfig.main.json')
  step('Compile renderer')
  run('npx vite build --mode renderer')
  fixDist()
  copyManifests()
} else { console.log('Skip build (--skip-build)'); copyManifests() }

const electronCli = path.join(ROOT, 'node_modules', 'electron', 'cli.js')
const child = spawn(process.execPath, [electronCli, '.'], {
  cwd: ROOT,
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
})
child.on('error', e => { console.error('Electron error:', e.message); process.exit(1) })
child.on('close', code => process.exit(code ?? 0))
process.on('SIGINT', () => { child.kill('SIGTERM') })