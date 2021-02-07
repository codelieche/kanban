import { ElMessage } from 'element-plus'

// 复制文本函数
export const copyTextFunc = (title: string, content: string) => {
  // console.dir(window)
  // 因为input是不能换行，当复制多行文本的时候用textarea即可
  const tmpInput = document.createElement('textarea')
  tmpInput.value = content // 设置内容
  document.body.appendChild(tmpInput) // 添加元素到body的后面
  tmpInput.select() // 选择对象
  document.execCommand('copy') // 执行浏览器复制命令
  ElMessage.success(`${title}:已复制到剪切板!`) // 弹出成功消息
  document.body.removeChild(tmpInput) // 记得移除掉这个

  // if (window.clipboardData) {
  //   window.clipboardData.clearData()
  //   window.clipboardData.setData('Text', content)
  //   ElMessage.success(`已复制${title}到剪切板!`)
  // } else {
  //   // 因为input是不能换行，当复制多行文本的时候用textarea即可
  //   const tmpInput = document.createElement('textarea')
  //   tmpInput.value = content // 设置内容
  //   document.body.appendChild(tmpInput) // 添加元素到body的后面
  //   tmpInput.select() // 选择对象
  //   document.execCommand('copy') // 执行浏览器复制命令
  //   ElMessage.success(`${title}:已复制到剪切板!`) // 弹出成功消息
  //   document.body.removeChild(tmpInput) // 记得移除掉这个
  // }
}

export default copyTextFunc
