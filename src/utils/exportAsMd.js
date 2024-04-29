import TurndownService from 'turndown'
import { gfm } from 'joplin-turndown-plugin-gfm'
import fileSaver from 'file-saver'
import { replaceImgSrc } from './dom'

let _turndownService = null
export function generalTurndownService() {
  if (!_turndownService) {
    _turndownService = new TurndownService()
    _turndownService.use(gfm)
  }

  return _turndownService
}

export default function exportAsMd(html, title) {
  const turndownService = generalTurndownService()
  const markdown = turndownService.turndown(replaceImgSrc(html))
  const blob = new Blob([markdown], { type: 'text/plain;charset=utf-8' })
  return fileSaver.saveAs(blob, title.endsWith('.md') ? title : `${title}.md`)
}
