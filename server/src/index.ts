import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

// Simple membership check for a few built-in languages.
function checkMembership(language: string, s: string): boolean {
  language = language.trim()
  if (language === 'a^n b^n') {
    const m = s.match(/^(a+)(b+)$/)
    return !!m && m[1].length === m[2].length
  }
  if (language === 'a^n b^n c^n') {
    const m = s.match(/^(a+)(b+)(c+)$/)
    return !!m && m[1].length === m[2].length && m[2].length === m[3].length
  }
  if (language === '(ab)^n') {
    return /^(?:ab)+$/.test(s)
  }

  // As a fallback, if the user provides a regex-like language (e.g. /^a+b+$/), try to use it safely.
  try {
    if (language.startsWith('/') && language.lastIndexOf('/') > 0) {
      const last = language.lastIndexOf('/')
      const pattern = language.slice(1, last)
      const flags = language.slice(last + 1)
      const re = new RegExp(pattern, flags)
      return re.test(s)
    }
  } catch (e) {
    // ignore invalid regex
  }

  // Unknown language -> cannot determine; return false conservatively.
  return false
}

app.post('/api/check', (req, res) => {
  const { language, string } = req.body || {}
  if (typeof language !== 'string' || typeof string !== 'string') {
    return res.status(400).json({ error: 'language and string are required' })
  }
  const result = checkMembership(language, string)
  res.json({ result })
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => console.log(`PLV API listening on http://localhost:${port}`))
