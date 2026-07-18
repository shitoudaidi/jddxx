import fs from 'fs'
import { paths } from './paths.js'

export const DEFAULT_AI_HOT_ENDPOINT = 'https://aihot.virxact.com/api/public/items'
const DEFAULT_TIMEOUT_MS = 12000
const DEFAULT_CACHE_MINUTES = 10
const USER_AGENT = 'jarvis-desktop/1.0 (+local-app)'

let cache = null
let inFlight = null

function readStoredConfig() {
  try {
    return JSON.parse(fs.readFileSync(paths.configFile, 'utf-8')) || {}
  } catch {
    return {}
  }
}

function readAiHotConfig() {
  const stored = readStoredConfig().aiHot || {}
  return {
    endpoint: String(stored.endpoint || process.env.AI_HOT_ENDPOINT || DEFAULT_AI_HOT_ENDPOINT).trim(),
    apiKey: String(stored.apiKey || process.env.AI_HOT_API_KEY || '').trim(),
  }
}

export function getAiHotConfig() {
  const config = readAiHotConfig()
  return {
    endpoint: config.endpoint,
    apiKeyConfigured: Boolean(config.apiKey),
    requiresApiKey: false,
    officialPublicEndpoint: config.endpoint === DEFAULT_AI_HOT_ENDPOINT,
  }
}

export function setAiHotConfig(updates = {}) {
  const existing = readStoredConfig()
  const current = existing.aiHot || {}
  const endpoint = String(updates.endpoint ?? current.endpoint ?? DEFAULT_AI_HOT_ENDPOINT).trim()
  if (!isHttpUrl(endpoint)) throw new Error('AI HOT endpoint must be an HTTP or HTTPS URL')
  const next = { ...current, endpoint }
  if (Object.prototype.hasOwnProperty.call(updates, 'apiKey')) {
    const apiKey = String(updates.apiKey || '').trim()
    if (apiKey) next.apiKey = apiKey
    else delete next.apiKey
  }
  fs.mkdirSync(paths.dataDir, { recursive: true })
  fs.writeFileSync(paths.configFile, `${JSON.stringify({ ...existing, aiHot: next }, null, 2)}\n`, 'utf-8')
  cache = null
  return getAiHotConfig()
}

function isHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim())
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function normalizeItem(item) {
  const title = String(item?.title || item?.title_en || '').trim()
  const url = String(item?.url || '').trim()
  if (!title || !isHttpUrl(url)) return null
  return {
    id: String(item?.id || url),
    title,
    titleEn: String(item?.title_en || '').trim(),
    summary: String(item?.summary || '').trim(),
    url,
    permalink: isHttpUrl(item?.permalink) ? String(item.permalink).trim() : '',
    source: String(item?.source || 'AI HOT').trim(),
    category: String(item?.category || '').trim(),
    score: Number.isFinite(Number(item?.score)) ? Number(item.score) : null,
    publishedAt: String(item?.publishedAt || '').trim(),
    attribution: 'AI HOT',
  }
}

function cacheFresh(now = Date.now()) {
  return Boolean(cache?.fetchedAtMs && now - cache.fetchedAtMs < DEFAULT_CACHE_MINUTES * 60 * 1000)
}

async function fetchAiHot() {
  const config = readAiHotConfig()
  if (!isHttpUrl(config.endpoint)) throw new Error('AI HOT endpoint is invalid')
  const endpoint = new URL(config.endpoint)
  endpoint.searchParams.set('mode', 'selected')
  endpoint.searchParams.set('take', '30')
  const headers = { Accept: 'application/json', 'User-Agent': USER_AGENT }
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`
  const response = await globalThis.fetch(endpoint, {
    headers,
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`AI HOT HTTP ${response.status}`)
  const payload = await response.json()
  const items = (Array.isArray(payload?.items) ? payload.items : []).map(normalizeItem).filter(Boolean)
  if (!items.length) throw new Error('AI HOT returned no items with original links')
  const fetchedAt = new Date().toISOString()
  cache = {
    ok: true,
    source: 'AI HOT',
    sourceUrl: 'https://aihot.virxact.com/',
    fetchedAt,
    fetchedAtMs: Date.now(),
    refreshMinutes: DEFAULT_CACHE_MINUTES,
    count: items.length,
    items,
  }
  return cache
}

export async function getAiNews({ force = false } = {}) {
  if (!force && cacheFresh()) return cache
  if (inFlight) return inFlight
  inFlight = fetchAiHot()
  try {
    return await inFlight
  } catch (error) {
    if (cache?.items?.length) return { ...cache, stale: true, warning: error.message }
    throw error
  } finally {
    inFlight = null
  }
}
