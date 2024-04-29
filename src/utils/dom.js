export function replaceImgSrc(html) {
  const imgReg = /<img.*?src="(.*?)".*?>/g
  return html.replace(imgReg, (match, p1) => {
    if (p1.startsWith('http') || p1.startsWith('https'))
      return match
    else if (p1.startsWith('/'))
      return `<img src="${window.location.origin}${p1}" />`
    else
      return `<img src="${window.location.origin}/${p1}" />`
  })
}
