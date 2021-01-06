/**
 * URL Params处理
 * URLSearchParams只有新的浏览器才支持，所以需要自己写一个
 * 这样可以做到浏览器的兼容
 */
class SelfURLSearchParams {
  url: string
  params: { [key: string]: string | null }

  constructor(url: string) {
    this.url = url
    this.params = this.parse(url)
  }

  get = (key: string): string | null => {
    return this.params[key]
  }

  set = (key: string, value: string | null) => {
    this.params[key] = value
  }

  parse = (str: string): { [key: string]: string | null } => {
    if (typeof str !== 'string') {
      return {}
    }
    const params: { [key: string]: string | null } = {}

    // 如果字符串是以？开头的，那么我们需要处理下
    if (str[0] === '?') {
      str = str.slice(1)
    }

    decodeURI(str)
      .split('&')
      .forEach(item => {
        const tmp = item.split('=')
        const key: string = tmp[0]
        const value: string | null = tmp[1] || null
        params[key] = value
      })
    return params
  }
}

export const getParamsFromLocationSearch = (
    paramsFields: Array<string>,
    locationSearch: string
  ): { [key: string]: string | null } => {
    // 处理url中传递的数据
    // console.log(paramsFields, locationSearch);
    const searchParams = new SelfURLSearchParams(locationSearch)
    // let page = searchParams.get("page");
    // // page需要是整数
    // if(isNaN(page)){
    //     page = 1;
    // }else{
    //     page = parseInt(page, 10);
    // }

    // 通过url可以传递的参数
    const params: { [key: string]: string | null } = {}

    paramsFields.forEach(item => {
      params[item] = searchParams.get(item)
    })
    return params
}

export const URLSearchParams = SelfURLSearchParams;
export default getParamsFromLocationSearch