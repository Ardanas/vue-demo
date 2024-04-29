import { domToBlob as toBlob, domToCanvas as toCanvas } from 'modern-screenshot'
import fileSaver from 'file-saver'
import { replaceImgSrc } from './dom'

export default async function exportAsImage(node, title) {
  const blob = await toBlob(node, { width: 800, scale: 4 })
  fileSaver(blob, title || 'test.png')
}

/**
 * 将 HTML 字符串数组转换为图片并保存
 * @param {string[]} htmlStrings - 包含 HTML 字符串的数组
 * @param {string} [fileName] - 保存的文件名
 * @param {string} [fileType] - 保存的文件类型
 * @returns {Promise<void>}
 */
export async function saveHTMLArrayAsImage(htmlStrings, fileName = 'image.png', fileType = 'image/png') {
  // 初始化一个空的 Blob 数组
//   const blobs = []
  const exportAreaEl = document.querySelector('#export-area')
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  const canvasList = []
  let width = 0
  let height = 0
  for (const htmlString of htmlStrings) {
    const div = document.createElement('div')
    div.innerHTML = replaceImgSrc(htmlString)
    exportAreaEl.appendChild(div)
    const canvas = await toCanvas(div, { backgroundColor: '#fff' })
    width = Math.max(width, canvas.width)
    canvasList.push({
      y: height,
      canvas,
    })
    height += canvas.height
    exportAreaEl.removeChild(div)
  }
  console.log('height', height)
  console.log('width', width)

  tempCanvas.width = width
  tempCanvas.height = height
  //   tempCtx.scale(devicePixelRatio, devicePixelRatio)
  canvasList.forEach((item) => {
    tempCtx.drawImage(item.canvas, 0, item.y, width, item.canvas.height)
  })

  tempCanvas.toBlob((blob) => {
    fileSaver(blob, fileName)
  })

  // 使用 FileSaver.js 保存最终的 Blob 对象为文件
  //   fileSaver(finalBlob, fileName)
  // 从页面中移除 div 元素
//   document.body.removeChild(div)
}

async function saveHTMLAsImage(html, fileName = 'image.png', fileType = 'image/png') {
  const node = document.createElement('div')
  node.innerHTML = replaceImgSrc(html)
  document.body.appendChild(node)
  const blob = await toBlob(node, { scale: 2 })
  fileSaver(blob, fileName)
  document.body.removeChild(node)
}

export async function exportAsImageByHtml(html, fileName) {
  if (Array.isArray(html))
    await saveHTMLArrayAsImage(html, fileName)
  else
    await saveHTMLAsImage(html, fileName)
}
