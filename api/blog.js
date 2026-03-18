/**
 * GET /api/blog
 * Fetches Unice's Medium RSS feed server-side (avoids CORS) and returns
 * the latest N articles as JSON.
 */

const MEDIUM_RSS = 'https://medium.com/feed/@unicebondoc'
const LIMIT = 2

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function extractTag(xml, tag) {
  // handles both <tag>value</tag> and CDATA <tag><![CDATA[value]]></tag>
  const re = new RegExp(`<${tag}(?:[^>]*)>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, 'i')
  const m = xml.match(re)
  if (!m) return ''
  return decodeEntities(m[1].trim())
}

function extractItems(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, 'title')
    // Medium puts the URL inside <link> as a text node after GUID
    const linkMatch = block.match(/<link\s*\/?>(.*?)<\/link>/i) || block.match(/<link>(.*?)<\/link>/i)
    const link = linkMatch ? decodeEntities(linkMatch[1].trim()) : ''
    const pubDate = extractTag(block, 'pubDate')
    // Pull a clean excerpt from description, strip HTML tags
    const descRaw = extractTag(block, 'description')
    const descStripped = descRaw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    const excerpt = descStripped.length > 160 ? descStripped.slice(0, 157) + '…' : descStripped

    if (title && link) {
      items.push({
        title,
        link,
        pubDate,
        excerpt,
      })
    }
    if (items.length >= LIMIT) break
  }
  return items
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

  try {
    const response = await fetch(MEDIUM_RSS, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0)' },
    })
    if (!response.ok) {
      return res.status(502).json({ error: `Medium RSS returned ${response.status}` })
    }
    const xml = await response.text()
    const articles = extractItems(xml)
    return res.status(200).json({ articles })
  } catch (err) {
    console.error('[api/blog]', err.message)
    return res.status(500).json({ error: 'Failed to fetch Medium feed' })
  }
}
