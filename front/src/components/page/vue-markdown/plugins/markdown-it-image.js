function parseNextNumber(str, pos, max) {
  let code
  const start = pos,
    result = {
      ok: false,
      pos: pos,
      value: ''
    }

  code = str.charCodeAt(pos)

  while (
    (pos < max && code >= 0x30 /* 0 */ && code <= 0x39) /* 9 */ ||
    code === 0x25 /* % */
  ) {
    code = str.charCodeAt(++pos)
  }

  result.ok = true
  result.pos = pos
  result.value = str.slice(start, pos)

  return result
}

function parseImageSize(str, pos, max) {
  let code
  

  const result = {
    ok: false,
    pos: 0,
    width: '',
    height: ''
  }

  if (pos >= max) {
    return result
  }
  // eslint-disable-next-line no-useless-escape
  // eslint-disable-next-line no-invalid-regexp
  // const r = new RegExp('(\\?|\\&)size\\=(\\d*)x(\\d*)')

  // const reResults = r.exec(str)
  // if(reResults  && reResults.length === 4){
  //   result.ok = true
  //   result.width = reResults[2]
  //   result.height = reResults[3]
  //   result.pos = str.indexOf('size=')
  // }

  code = str.charCodeAt(pos)

  if (code !== 0x3d /* = */) {
    return result
  }

  pos++

  // size must follow = without any white spaces as follows
  // (1) =300x200
  // (2) =300x
  // (3) =x200
  code = str.charCodeAt(pos)
  if (code !== 0x78 /* x */ && (code < 0x30 || code > 0x39) /* [0-9] */) {
    return result
  }

  // parse width
  const resultW = parseNextNumber(str, pos, max)
  pos = resultW.pos

  // next charactor must be 'x'
  code = str.charCodeAt(pos)
  if (code !== 0x78 /* x */) {
    return result
  }

  pos++

  // parse height
  // console.log('str:', str)
  const resultH = parseNextNumber(str, pos, max)
  pos = resultH.pos

  result.width = resultW.value
  result.height = resultH.value
  result.pos = pos
  // console.log('reesultH:', resultH)
  // console.log('result:', result)
  result.ok = true
  return result
}

export default (md, options) => {
  //   console.log(options)
  if (options === undefined || options === {}) {
    options = { hAlign: 'left', viewer: true, urlSet: new Set() }
  }
  md.inline.ruler.before('emphasis', 'image', (state, silent) => {
    let attrs,
      code,
      content,
      label,
      pos,
      ref,
      res,
      title,
      token,
      tokens,
      start,
      href = '',
      width = '',
      height = ''
    const oldPos = state.pos,
      max = state.posMax
    // console.log('state.src:', state.src)
    // 图片大小用 &/?size=wxh
    if (state.src.indexOf('?size=') > 0) {
      state.src = state.src.replace('?size=', ' =')
    } else if (state.src.indexOf('&size=') > 0) {
      state.src = state.src.replace('&size=', ' =')
    }

    if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */) {
      return false
    }
    if (state.src.charCodeAt(state.pos + 1) !== 0x5b /* [ */) {
      return false
    }

    const labelStart = state.pos + 2
    const labelEnd = state.md.helpers.parseLinkLabel(
      state,
      state.pos + 1,
      false
    )

    // parser failed to find ']', so it's not a valid link
    if (labelEnd < 0) {
      return false
    }

    pos = labelEnd + 1
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
      //
      // Inline link
      //

      // [link](  <href>  "title"  )
      //        ^^ skipping these spaces
      pos++
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (!md.utils.isSpace(code) && code !== 0x0a) {
          break
        }
      }
      if (pos >= max) {
        return false
      }

      // [link](  <href>  "title"  )
      //          ^^^^^^ parsing link destination
      start = pos
      res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax)
      if (res.ok) {
        href = state.md.normalizeLink(res.str)
        if (state.md.validateLink(href)) {
          pos = res.pos
        } else {
          href = ''
        }
      }

      // [link](  <href>  "title"  )
      //                ^^ skipping these spaces
      start = pos
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (!md.utils.isSpace(code) && code !== 0x0a) {
          break
        }
      }

      // [link](  <href>  "title"  )
      //                  ^^^^^^^ parsing link title
      res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax)
      if (pos < max && start !== pos && res.ok) {
        title = res.str
        pos = res.pos

        // [link](  <href>  "title"  )
        //                         ^^ skipping these spaces
        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos)
          if (!md.utils.isSpace(code) && code !== 0x0a) {
            break
          }
        }
      } else {
        title = ''
      }

      // [link](  <href>  "title" =WxH  )
      //                          ^^^^ parsing image size
      if (pos - 1 >= 0) {
        code = state.src.charCodeAt(pos - 1)

        // there must be at least one white spaces
        // between previous field and the size
        if (code === 0x20) {
          res = parseImageSize(state.src, pos, state.posMax)
          if (res.ok) {
            width = res.width
            height = res.height
            pos = res.pos

            // [link](  <href>  "title" =WxH  )
            //                              ^^ skipping these spaces
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos)
              if (code !== 0x20 && code !== 0x0a) {
                break
              }
            }
          }
        }
      }

      if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
        state.pos = oldPos
        return false
      }
      pos++
    } else {
      //
      // Link reference
      //
      if (typeof state.env.references === 'undefined') {
        return false
      }

      if (pos < max && state.src.charCodeAt(pos) === 0x5b /* [ */) {
        start = pos + 1
        pos = state.md.helpers.parseLinkLabel(state, pos)
        if (pos >= 0) {
          label = state.src.slice(start, pos++)
        } else {
          pos = labelEnd + 1
        }
      } else {
        pos = labelEnd + 1
      }

      // covers label === '' and label === undefined
      // (collapsed reference link and shortcut reference link respectively)
      if (!label) {
        label = state.src.slice(labelStart, labelEnd)
      }

      ref = state.env.references[md.utils.normalizeReference(label)]
      if (!ref) {
        state.pos = oldPos
        return false
      }
      href = ref.href
      title = ref.title
    }

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      content = state.src.slice(labelStart, labelEnd)

      state.md.inline.parse(content, state.md, state.env, (tokens = []))

      const div = state.push('image-container-open', 'div', 1)
      div.block = true
      // 判断图片对齐方式：是left/center/right
      let textAlignValue = options.hAlign

      // eslint-disable-next-line no-useless-escape
      // eslint-disable-next-line no-invalid-regexp
      const rAlign = new RegExp('(\\?|\\&)align\\=(left|center|right)')
      // 获取对齐方式
      const rAlignResult = rAlign.exec(state.src)
      if ( Array.isArray(rAlignResult) && rAlignResult.length === 3 ) {
        textAlignValue = rAlignResult[2]
        // state.src = state.src.replace(rAlignResult[0], '')
        href = href.replace(rAlignResult[0], '')
      }
      // 判断图片链接的样式
      let classNames = ""
      const rClass = new RegExp('(\\?|\\&)class\\=([0-9a-zA-Z\\-_,]+)')
      const rClassResult = rClass.exec(href)
      if(Array.isArray(rClassResult) && rClassResult.length == 3){
        classNames = rClassResult[2]
        href = href.replace(rClassResult[0], '')
      }
      if (classNames !== "") {
        classNames = classNames.replace(',', ' ')
        div.attrs = [
          ['style', `text-align: ${textAlignValue}`],
          ['class', classNames]
        ]
      } else {
        div.attrs = [
          ['style', `text-align: ${textAlignValue}`],
        ]
      }
      


      token = state.push('image', 'img', 0)
      token.attrs = attrs = [
        ['src', href],
        ['alt', ''],
      ]
      token.children = tokens
      token.content = content

      if (title) {
        attrs.push(['title', title])
      }

      if (width !== '') {
        attrs.push(['width', width])
      }

      if (height !== '') {
        attrs.push(['height', height])
      }
    }
    state.push('image-container-close', 'div', -1)
    state.pos = pos
    state.posMax = max
    options.urlSet.add(href)
    return true
  })
}
