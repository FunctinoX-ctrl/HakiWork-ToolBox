const { spawn, execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const Args = process.argv.slice(2)
const SKIP_BUILD = Args.includes('--skip-build')
const BUILD_ONLY = Args.includes('--build-only')

const ESC = String.fromCharCode(27)

function step(msg) {
  console.log(ESC + '[1m' + ESC + '[33m▼ ' + msg + ESC + '[0m')
}

function run(cmd, label) {
  try { execSync(cmd, { cwd: ROOT, stdio: 'inherit' }) }
  catch (err) { console.error(ESC + '[31mERROR:' + ESC + '[0m', label || cmd, err.message); process.exit(1) }
}

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

function compilePlugins() {
  step('Compile plugins')
  const pluginsSrcDir = path.join(ROOT, 'plugins')
  const pluginsDistDir = path.join(ROOT, 'dist', 'plugins')

  if (fs.existsSync(pluginsDistDir)) {
    fs.rmSync(pluginsDistDir, { recursive: true, force: true })
  }
  fs.mkdirSync(pluginsDistDir, { recursive: true })

  if (!fs.existsSync(pluginsSrcDir)) {
    console.log(ESC + '[33m⚠ No plugins source directory found' + ESC + '[0m')
    return
  }

  // Copy shared types to dist for resolution
  const sharedSrc = path.join(ROOT, 'src', 'shared')
  const sharedDst = path.join(pluginsDistDir, 'src', 'shared')
  if (fs.existsSync(sharedSrc)) {
    fs.mkdirSync(sharedDst, { recursive: true })
    for (const f of fs.readdirSync(sharedSrc)) {
      if (f.endsWith('.ts') || f.endsWith('.d.ts')) {
        fs.copyFileSync(path.join(sharedSrc, f), path.join(sharedDst, f))
      }
    }
  }

  const packages = fs.readdirSync(pluginsSrcDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)

  for (const pkg of packages) {
    const pkgSrcDir = path.join(pluginsSrcDir, pkg)
    const pkgDistDir = path.join(pluginsDistDir, pkg)
    fs.mkdirSync(pkgDistDir, { recursive: true })

    const pluginDirs = fs.readdirSync(pkgSrcDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(pkgSrcDir, e.name, 'manifest.json')))
      .map(e => e.name)

    for (const pluginName of pluginDirs) {
      const pluginSrcDir = path.join(pkgSrcDir, pluginName)
      const pluginDistDir = path.join(pkgDistDir, pluginName)
      fs.mkdirSync(pluginDistDir, { recursive: true })

      // Copy manifest
      const manifestSrc = path.join(pluginSrcDir, 'manifest.json')
      if (fs.existsSync(manifestSrc)) {
        fs.copyFileSync(manifestSrc, path.join(pluginDistDir, 'manifest.json'))
      }

      const srcDir = path.join(pluginSrcDir, 'src')
      if (!fs.existsSync(srcDir)) continue
      const dstSrcDir = path.join(pluginDistDir, 'src')
      fs.mkdirSync(dstSrcDir, { recursive: true })

      const tsFiles = fs.readdirSync(srcDir)
        .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))

      for (const file of tsFiles) {
        const srcFile = path.join(srcDir, file)
        const isTsx = file.endsWith('.tsx')
        const outFile = isTsx ? file.replace('.tsx', '.js') : file.replace('.ts', '.js')
        const dstFile = path.join(dstSrcDir, outFile)

        try {
          const esbuild = require('esbuild')
          esbuild.buildSync({
            entryPoints: [srcFile],
            outfile: dstFile,
            bundle: true,
            platform: 'node',
            target: 'node18',
            format: 'cjs',
            external: ['electron', 'react', 'react-dom'],
            tsconfig: path.join(ROOT, 'tsconfig.plugins.json'),
          })
        } catch (e) {
          fs.copyFileSync(srcFile, dstFile)
        }
      }

      console.log(ESC + '[32m  ✓ ' + pluginName + ' compiled' + ESC + '[0m')
    }
  }
  console.log(ESC + '[32m✓ Plugin compilation complete' + ESC + '[0m')
}

step('HakiWork v1.0.0')

if (BUILD_ONLY) {
  step('Compile main process')
  run('npx tsc -p tsconfig.main.json')
  run('npx tsc-alias -p tsconfig.main.json')
  step('Compile renderer')
  run('npx vite build --mode renderer')
  fixDist()
  compilePlugins()
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
  compilePlugins()
} else { console.log('Skip build (--skip-build)'); compilePlugins() }

const electronCli = path.join(ROOT, 'node_modules', 'electron', 'cli.js')
const child = spawn(process.execPath, [electronCli, '.'], {
  cwd: ROOT,
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
})
child.on('error', e => { console.error('Electron error:', e.message); process.exit(1) })
child.on('close', code => process.exit(code ?? 0))
process.on('SIGINT', () => { child.kill('SIGTERM') })