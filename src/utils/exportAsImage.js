import { domToBlob as toBlob, domToCanvas as toCanvas } from 'modern-screenshot'
import fileSaver from 'file-saver'
import { replaceImgSrc } from './dom'

export default async function exportAsImage(node, title) {
  const blob = await toBlob(node, { width: 800, scale: 4 })
  fileSaver(blob, title || 'test.png')
}

export async function generalCanvasByHtmlArray(htmlStrings) {
  let exportAreaEl = document.querySelector('#export-area')
  if (!exportAreaEl) {
    exportAreaEl = document.createElement('div')
    exportAreaEl.id = 'export-area'
    document.body.appendChild(exportAreaEl)
  }
  // exportAreaEl.classList.add('prose')
  const contentWidth = exportAreaEl.offsetWidth
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  const canvasList = []

  let height = 0
  for (const htmlString of htmlStrings) {
    const div = document.createElement('div')
    div.innerHTML = replaceImgSrc(htmlString)
    exportAreaEl.appendChild(div)
    const canvas = await toCanvas(exportAreaEl, { backgroundColor: '#fff', scale: devicePixelRatio })
    const { height: canvasHeight } = canvas
    canvasList.push({
      y: height,
      canvas,
    })
    height += canvasHeight
    exportAreaEl.removeChild(div)
  }

  tempCanvas.width = contentWidth * devicePixelRatio
  tempCanvas.height = height * devicePixelRatio
  tempCtx.scale(devicePixelRatio, devicePixelRatio)
  canvasList.forEach((item) => {
    tempCtx.drawImage(item.canvas, 0, item.y, item.canvas.width, item.canvas.height)
  })

  return tempCanvas
}

export async function saveHtmlArrayAsImage(htmlStrings, fileName = 'image.png') {
  const tempCanvas = await generalCanvasByHtmlArray(htmlStrings)

  tempCanvas.toBlob((blob) => {
    fileSaver(blob, fileName)
  })
}

async function saveHtmlAsImage(html, fileName = 'image.png', fileType = 'image/png') {
  const exportAreaEl = document.querySelector('#export-area')
  const div = document.createElement('div')
  div.innerHTML = replaceImgSrc(html)
  exportAreaEl.appendChild(div)
  const blob = await toBlob(div, { scale: 2 })
  fileSaver(blob, fileName)
  exportAreaEl.removeChild(div)
}

export async function exportAsImageByHtml(html, fileName) {
  if (Array.isArray(html))
    await saveHtmlArrayAsImage(html, fileName)
  else
    await saveHtmlAsImage(html, fileName)
}
