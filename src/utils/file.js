import fileSaver from 'file-saver'
import exportAsMd from './exportAsMd'

export function mdSaver(markdown, title) {
  const blob = new Blob([markdown], { type: 'text/plain;charset=utf-8' })
  fileSaver.saveAs(blob, title.endsWith('.md') ? title : `${title}.md`)
}

export function mdSaverByHtml(html, title) {
  const md = exportAsMd(html)
  const blob = new Blob([md], { type: 'text/plain;charset=utf-8' })
  fileSaver.saveAs(blob, title.endsWith('.md') ? title : `${title}.md`)
}
