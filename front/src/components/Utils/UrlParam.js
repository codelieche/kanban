/**
 * URL Params处理
 * URLSearchParams只有新的浏览器才支持，所以需要自己写一个
 * 这样可以做到浏览器的兼容
 */

class SelfURLSearchParams {
    constructor(url){
        this.url = url;
        this.params = this.parse(url);
    }

    get =  (key) => {
        return this.params[key];
    }

    set = (key, value) => {
        this.params[key] = value;
    }

    parse = (str) => {
        if (typeof str !== 'string'){
          return {};
        }

        // 如果字符串是以？开头的，那么我们需要处理下
        if(str[0] === '?'){
            str = str.slice(1, );
        }

        return decodeURI(str).split('&').map(param => {
          const tmp = param.split('=');
          const key = tmp[0];
          let value = tmp[1] || true;
          if (typeof value === 'string' && isNaN(Number(value)) === false) {
            value = Number(value);
          }
          // 这里返回的是map函数的返回
          return { key, value };
        }).reduce((params, item) => {
            // map函数返回了一个数组，然后用reuce来处理
            // 最开始params是个空对象{}
            const { key, value } = item;
            if (typeof params[key] === 'undefined') {
                params[key] = value;
            }else {
                // 如果某个key传了多次，那么其value将会是个数组
                params[key] = Array.isArray(params[key]) ? params[key] : [params[key]];
                params[key].push(value);
            }
          // parse函数的返回结果
          return params;
        }, {});
      }

}

/**
 * 从url中location.search中获取params参数
 * @param {Array} paramsFields: 要获取的字段名列表：eg: ["page", "search", "ordering", "state"]
 * @param {string} locationSearch: url传递的params值，比如：?page=5&search=code
 */
function getParamsFromLocationSearch(paramsFields, locationSearch){
    // 处理url中传递的数据
    // console.log(paramsFields, locationSearch);
    let searchParams = new URLSearchParams(locationSearch);
    // let page = searchParams.get("page");
    // // page需要是整数
    // if(isNaN(page)){
    //     page = 1;
    // }else{
    //     page = parseInt(page, 10);
    // }

    // 通过url可以传递的参数
    let params = {};

    paramsFields.forEach(item => {
        params[item] = searchParams.get(item);
    });
    return params;
}

var URLSearchParamsClass = SelfURLSearchParams;
if(window.URLSearchParams){
    // URLSearchParamsClass = URLSearchParams;
    // console.log("浏览器支持:URLSearchParams");
    // console.log(window.URLSearchParams);
}else{
    // console.log("浏览器不支持URLSearchParams");
}

export default URLSearchParamsClass;

export {
    URLSearchParamsClass as URLSearchParams,
    getParamsFromLocationSearch
}