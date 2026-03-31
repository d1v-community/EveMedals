import { existsSync } from 'node:fs'
import path from 'node:path'
import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const testsDirectory = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(testsDirectory, '../src/app')
const candidates = [
  '',
  '.ts',
  '.tsx',
  '.mjs',
  '.js',
  '.json',
  '/index.ts',
  '/index.tsx',
  '/index.mjs',
  '/index.js',
]

const resolveCandidate = (basePath) => {
  for (const suffix of candidates) {
    const candidate = `${basePath}${suffix}`
    if (existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('~~/')) {
      const candidate = resolveCandidate(path.resolve(appRoot, specifier.slice(3)))

      if (!candidate) {
        throw new Error(`Unable to resolve alias specifier: ${specifier}`)
      }

      return { shortCircuit: true, url: pathToFileURL(candidate).href }
    }

    if (
      specifier.startsWith('./') ||
      specifier.startsWith('../') ||
      specifier.startsWith('/')
    ) {
      const parentPath = context.parentURL?.startsWith('file:')
        ? fileURLToPath(context.parentURL)
        : process.cwd()
      const basePath = specifier.startsWith('/')
        ? specifier
        : path.resolve(path.dirname(parentPath), specifier)
      const candidate = resolveCandidate(basePath)

      if (candidate) {
        return { shortCircuit: true, url: pathToFileURL(candidate).href }
      }
    }

    return nextResolve(specifier, context)
  },
})
