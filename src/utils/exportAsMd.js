import TurndownService from 'turndown'
import { gfm } from 'joplin-turndown-plugin-gfm'

let _turndownService = null
export function generalTurndownService() {
  if (!_turndownService) {
    _turndownService = new TurndownService()
    _turndownService.use(gfm)
  }

  return _turndownService
}

export default function exportAsMd(html) {
  const turndownService = generalTurndownService()
  const markdown = turndownService.turndown(html)
  return markdown
}
