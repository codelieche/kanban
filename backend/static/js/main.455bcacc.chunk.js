(this.webpackJsonpkanban=this.webpackJsonpkanban||[]).push([[6],{11:function(e,t,a){"use strict";var n=a(117),c=a(202),r=a.n(c),l=a(203),i=a.n(l),o="",s=2e4,u=r.a.create({baseURL:o,timeout:s});u.defaults.headers.common["Content-Type"]="application/json",u.defaults.withCredentials=!0,u.interceptors.request.use((function(e){return"post"!==e.method&&"put"!==e.method&&"patch"!==e.method||!e.data instanceof String&&(e.data=i.a.stringify(e.data)),e}),(function(e){return Promise.reject(e)})),u.interceptors.response.use((function(e){if("delete"===e.config.method)return Promise.resolve(e);var t=e.data;return Promise.resolve(t)}),(function(e){if(/timeout/.test(e.message)&&console.log("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01"),e.response)switch(e.response.status){case 401:var t="/user/login?next="+window.location.href,a=window.location.origin+t;window.location.href=a;break;case 403:case 404:break;case 500:console.log("\u670d\u52a1\u5668\u9519\u8bef\uff01");break;case 503:console.log("\u670d\u52a1\u5668\u54cd\u5e94\u4e0d\u8fc7\u6765\uff01");break;default:console.log("\u9ed8\u8ba4\u9519\u8bef\u63d0\u793a")}return Promise.reject(e.response)}));var m=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.post(e,t,a)};t.a={Get:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.get(e,Object(n.a)({},a,{params:t}))},Post:m,Put:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.put(e,t,a)},Patch:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.patch(e,t,a)},Delete:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u.delete(e,Object(n.a)({},a,{params:t}))},testFetch:function(){m("/api/v1/account/login",{},{data:{username:"admin",password:"abc123456"},headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(e){console.log(e)})).catch((function(e){console.log(e)}))}}},13:function(e,t,a){"use strict";a.d(t,"b",(function(){return r})),a.d(t,"a",(function(){return l}));var n=a(0),c=a.n(n),r=c.a.createContext({}),l=c.a.createContext({});c.a.createRef({});t.c=l},150:function(e,t,a){"use strict";a.d(t,"b",(function(){return c}));var n=a(88);function c(e,t){var a=new URLSearchParams(t),n={};return e.forEach((function(e){n[e]=a.get(e)})),n}var r=function e(t){var a=this;Object(n.a)(this,e),this.get=function(e){return a.params[e]},this.set=function(e,t){a.params[e]=t},this.parse=function(e){return"string"!==typeof e?{}:("?"===e[0]&&(e=e.slice(1)),decodeURI(e).split("&").map((function(e){var t=e.split("="),a=t[0],n=t[1]||!0;return"string"===typeof n&&!1===isNaN(Number(n))&&(n=Number(n)),{key:a,value:n}})).reduce((function(e,t){var a=t.key,n=t.value;return"undefined"===typeof e[a]?e[a]=n:(e[a]=Array.isArray(e[a])?e[a]:[e[a]],e[a].push(n)),e}),{}))},this.url=t,this.params=this.parse(t)};window.URLSearchParams,t.a=r},240:function(e,t,a){e.exports=a(409)},4:function(e,t,a){"use strict";var n=a(88),c=a(157),r=a(160),l=a(158),i=a(161),o=a(0),s=a.n(o);s.a.Component;t.a=function(e){var t=e.type,a=e.spin,n=e.danger,c=e.className,r=e.children,l=Object(o.useMemo)((function(){var e="fa fa-".concat(t);return a&&(e+=" fa-spin"),n&&(e+=" danger"),e}),[n,a,t]);return s.a.createElement("span",{className:c,style:{display:"inline-block",padding:"0 3px"}},s.a.createElement("i",{className:l},r))}},407:function(e,t,a){},408:function(e,t,a){},409:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(6),l=a.n(r),i=a(5),o=a(43),s=a(13),u=(a(76),a(18)),m=a(3),f=a(90),d=a(4),p=(a(228),a(204)),E=a(11),b=function e(t){var a,r,l,o=t.item,s=t.index,u=t.collapsed,f=t.defaultOpenKey,E=Object(n.useState)(!1),b=Object(m.a)(E,2),h=b[0],g=b[1],v=o.children.map((function(t,a){return c.a.createElement(e,{item:t,index:a,key:a,collapsed:u})})),O=Object(n.useCallback)((function(e){g((function(e){return!e}))}),[]);return Object(n.useEffect)((function(){u||(f===o.key?g(!0):g(!1))}),[u,f,o.key]),o.icon&&(a=c.a.createElement(d.a,{type:o.icon})),v.length>0&&(r=c.a.createElement("div",{className:"right"},c.a.createElement(d.a,{type:h?"caret-down":"caret-left"}))),u?v.length>0?c.a.createElement(p.a,{title:o.title,content:c.a.createElement("div",{className:"collapsed-nav-children"},v),placement:"rightTop"},c.a.createElement("div",{className:"item"},c.a.createElement("div",{className:"title"},c.a.createElement(d.a,{type:o.icon?o.icon:"angle-right"}),o.level<=1?null:o.title))):o.is_link&&o.link?c.a.createElement("div",{className:"item"},c.a.createElement("a",{href:o.link,target:"_blank"===o.target?"_blank":"",rel:"noopener noreferrer"},c.a.createElement("div",{className:"title"},c.a.createElement(d.a,{type:o.icon?o.icon:"angle-right"}),o.title?o.title:"\u65e0\u6807\u9898"))):c.a.createElement("div",{className:"item"},c.a.createElement(i.c,{to:o.slug,activeClassName:"active",target:"_blank"===o.target?"_blank":""},c.a.createElement("div",{className:"title"},c.a.createElement(d.a,{type:o.icon?o.icon:"angle-right"}),o.title?o.title:"\u65e0\u6807\u9898"))):(l=v.length>0?c.a.createElement("div",null,c.a.createElement("div",{className:"title",style:{paddingLeft:12*o.level},onClick:O},a,o.title?o.title:"\u65e0\u6807\u9898",r)):o.is_link&&o.link?c.a.createElement("a",{href:o.link,target:o.target,rel:"noopener noreferrer"},c.a.createElement("div",{className:"title",style:{paddingLeft:12*o.level}},a,o.title?o.title:"\u65e0\u6807\u9898",r)):c.a.createElement(i.c,{to:o.slug,activeClassName:"active",target:"_blank"===o.target?"_blank":""},c.a.createElement("div",{className:"title",style:{paddingLeft:12*o.level},onClick:O},a,o.title?o.title:"\u65e0\u6807\u9898",r)),c.a.createElement("div",{className:"item",key:s},l,u?"\u6298\u53e0":"",v.length>0&&c.a.createElement("div",{className:h?"children active":"children"},v)))},h=function(e){var t=Object(n.useState)(null),a=Object(m.a)(t,2),r=a[0],l=a[1],i=Object(n.useState)(!1),o=Object(m.a)(i,2),s=o[0],u=o[1],f=Object(n.useCallback)((function(){E.a.Get("/api/v1/account/user/nav/list").then((function(e){e instanceof Array?l(e):console.log("\u83b7\u53d6\u5bfc\u822a\u6570\u636e\u51fa\u9519")})).catch((function(e){console.log(e)}))}),[]);Object(n.useEffect)((function(){f()}),[f]),Object(n.useEffect)((function(){e.collapsed!==s&&u(e.collapsed)}),[s,e.collapsed]);var d=Object(n.useMemo)((function(){return r&&r.length>0?r.map((function(t,a){return c.a.createElement(b,{item:t,index:a,key:a,collapsed:s,defaultOpenKey:e.defaultOpenKey})})):null}),[s,r,e.defaultOpenKey]);return c.a.createElement("div",{className:"nav-list"},d)};var g=function(e){var t=e.showLeftSider,a=e.setShowLeftSider,r=e.defaultOpenKey,l=Object(n.useState)(null),o=Object(m.a)(l,2),s=o[0],p=o[1],E=Object(n.useMemo)((function(){var e=localStorage.getItem("leftSiderWidth"),t=parseInt(e);return t&&t>=156&&t<=460?t:200}),[]),b=Object(n.useState)(E),g=Object(m.a)(b,2),v=g[0],O=g[1];Object(n.useEffect)((function(){return function(){localStorage.setItem("leftSiderWidth",v)}}),[v]);var j=Object(n.useCallback)((function(e,t){t.element;var a=t.size;a.width<156?O(156):a.width<=460?O(a.width):O(460)}),[O]),y=Object(n.useCallback)((function(e){e.preventDefault(),a((function(e){return localStorage.setItem("showLeftSider",!e),!e}))}),[a]),N=Object(n.useMemo)((function(){return t?c.a.createElement(h,{collapsed:s,defaultOpenKey:r}):null}),[t,s,r]),S=Object(n.useCallback)((function(){p((function(e){return!e}))}),[p]);return Object(n.useEffect)((function(){if(null===s){var e=localStorage.getItem("leftSiderNavCollapsed");p(null!==e&&"true"===e)}return localStorage.setItem("leftSiderNavCollapsed",s),function(){localStorage.setItem("leftSiderNavCollapsed",s)}}),[s]),c.a.createElement(f.Resizable,{className:"box",axis:"x",height:0,width:v,onResize:j},c.a.createElement(u.a.Sider,{style:{height:"100vh"},width:s?64:v},c.a.createElement("div",{className:s?"left-sider collapsed":"left-sider"},c.a.createElement("div",{className:"header"},c.a.createElement("div",{className:"logo"},c.a.createElement(i.b,{to:"/"},c.a.createElement("img",{alt:"logo",src:"/static/image/logo-kanban.svg"})),c.a.createElement("div",{className:"toogle",onClick:y,style:{display:s?"none":""}},c.a.createElement(d.a,{type:"angle-double-left",noMarginRight:!0})),c.a.createElement("div",{className:"clear"})),c.a.createElement("div",{className:"clear"})),c.a.createElement("div",{className:"content"},N),c.a.createElement("div",{className:"footer",onClick:S},c.a.createElement("div",{className:"collapsed-toogle"},c.a.createElement(d.a,{type:s?"indent":"outdent"}))))))},v=a(25),O=(a(326),a(109));var j=function(e){var t=e.data;if(t&&t instanceof Array){var a=t.map((function(e,t){var a;return e.icon&&(a=c.a.createElement(d.a,{type:e.icon,noMarginRight:!0})),e.link?c.a.createElement(O.a.Item,{key:t},c.a.createElement(i.b,{to:e.link},a,e.title)):c.a.createElement(O.a.Item,{key:t},a,e.title)}));return c.a.createElement(O.a,{className:"nav"},a)}return null},y=(a(111),a(30)),N=function(e){var t=e.history,a=Object(n.useState)(!1),r=Object(m.a)(a,2),l=r[0],i=r[1],o=Object(n.useState)(""),s=Object(m.a)(o,2),u=s[0],f=s[1],p=Object(n.useCallback)((function(e){f(e.target.value)}),[]),E=Object(n.useCallback)((function(e){var a="/tools/search?search=".concat(e);t.push(a)}),[t]);return l?c.a.createElement("div",{className:"search",onMouseLeave:function(){i(!1)}},c.a.createElement(y.a.Search,{value:u,allowClear:!0,onChange:p,onSearch:E})):c.a.createElement("div",{className:"search",onMouseEnter:function(){i(!0)}},c.a.createElement(d.a,{type:"search"}))},S=(a(114),a(86)),k=(a(120),a(17)),w=function(e){var t=Object(n.useState)(!1),a=Object(m.a)(t,2),r=a[0],l=a[1],o=Object(n.useState)({}),s=Object(m.a)(o,2),u=s[0],f=s[1],p=Object(n.useState)(!1),b=Object(m.a)(p,2),h=b[0],g=b[1],v=Object(n.useCallback)((function(){E.a.Get("/api/v1/account/login").then((function(e){g(!0),e.logined?(l(!0),f({username:e.username})):(l(!1),f({username:"\u672a\u767b\u5f55"}))})).catch((function(e){console.log(e),g(!0)}))}),[l,f]);if(Object(n.useEffect)((function(){v()}),[v]),h){if(r){var O=c.a.createElement(k.a,null,c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/user/center"},c.a.createElement(d.a,{type:"user-circle"}," \u7528\u6237\u4e2d\u5fc3"))),c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/docs/group"},c.a.createElement(d.a,{type:"folder"}," \u6587\u6863\u5206\u7ec4"))),c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/docs/article/list"},c.a.createElement(d.a,{type:"file-text-o"}," \u6587\u7ae0\u5217\u8868"))),c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/docs/image"},c.a.createElement(d.a,{type:"image"}," \u56fe\u7247\u5217\u8868"))),c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/user/message"},c.a.createElement(d.a,{type:"envelope-o"}," \u6d88\u606f\u4e2d\u5fc3"))),c.a.createElement(k.a.Item,null,c.a.createElement(i.b,{to:"/user/logout"},c.a.createElement(d.a,{type:"sign-out"}," \u9000\u51fa\u767b\u5f55"))));return c.a.createElement(S.a,{overlay:O},c.a.createElement("div",null,c.a.createElement(d.a,{type:"user-o"}),"Hi ~ ",u.username))}return c.a.createElement(i.b,{to:"/user/login"},c.a.createElement(d.a,{type:"sign-in"}),"\u767b\u5f55")}return null},C=Object(v.a)((function(){return a.e(5).then(a.bind(null,1276))})),x=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(2),a.e(12)]).then(a.bind(null,1279))})),I=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(4),a.e(14)]).then(a.bind(null,1282))})),L=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(4),a.e(16)]).then(a.bind(null,1283))})),P=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(2),a.e(13)]).then(a.bind(null,1278))})),D=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(4),a.e(15)]).then(a.bind(null,1284))})),M=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(2),a.e(8)]).then(a.bind(null,1281))}));var A=function(e){var t=Object(n.useState)("align-justify"),a=Object(m.a)(t,2),r=a[0],l=a[1],i=Object(n.useContext)(s.a).navData,u=Object(n.useCallback)((function(t){t.preventDefault(),e.setShowLeftSider((function(e){return localStorage.setItem("showLeftSider",!e),!e}))}),[e]);return c.a.createElement("div",{className:"right-content"},c.a.createElement("div",{className:"header"},c.a.createElement("div",{className:"toogle",onClick:u,onMouseEnter:function(e){l("angle-double-right")},onMouseLeave:function(e){l("align-justify")},style:{display:e.showLeftSider?"none":"inline-block"}},c.a.createElement(d.a,{type:r})),c.a.createElement(j,{data:i}),c.a.createElement("div",{className:"right"},c.a.createElement(N,{history:e.history}),c.a.createElement("div",{className:"user"},c.a.createElement(w,null)))),c.a.createElement("div",{className:"container"},c.a.createElement(o.d,null,c.a.createElement(o.b,{path:"/docs/",component:x,location:e.location}),c.a.createElement(o.b,{path:"/tags/",component:I,location:e.location}),c.a.createElement(o.b,{path:"/tools/",component:L,location:e.location}),c.a.createElement(o.b,{path:"/user",component:P,location:e.location}),c.a.createElement(o.b,{path:"/config",component:D,location:e.location}),c.a.createElement(o.b,{path:"/test",component:M,location:e.location}))),c.a.createElement(C,null))};var R=function(e){var t,a=Object(n.useState)(!1),r=Object(m.a)(a,2),l=r[0],i=r[1],o=Object(n.useState)(0),f=Object(m.a)(o,2),d=f[0],p=f[1],E=Object(n.useState)([{title:"\u9996\u9875",icon:"home",link:"/"}]),b=Object(m.a)(E,2),h=b[0],v=b[1];return Object(n.useEffect)((function(){var t=localStorage.getItem("showLeftSider");null!==t?(t!==l.toString()&&i("true"===t),"/"===e.location.pathname&&(document.title="\u770b\u677f-\u9996\u9875",h.length>1&&v([{title:"\u9996\u9875",icon:"home",link:"/"}]))):i(!0)}),[h.length,e.location.pathname,l]),l&&(t=c.a.createElement(g,{showLeftSider:l,setShowLeftSider:i,refreshNavTimes:d,defaultOpenKey:e.defaultOpenKey})),c.a.createElement(s.a.Provider,{value:{navData:h,setNavData:v,history:e.history,refreshNavTimes:d,setRefreshNavTimes:p}},c.a.createElement(u.a,{className:"left-right-layout"},t,c.a.createElement(u.a,null,c.a.createElement(u.a.Content,null,c.a.createElement(A,Object.assign({},e,{showLeftSider:l,setShowLeftSider:i}))))))},T=(a(82),a(16)),K=function e(t){var a=t.item,r=t.index,l=t.activeNavIDs,o=t.canWrite,u=Object(n.useState)(!1),f=Object(m.a)(u,2),p=f[0],b=f[1],h=Object(n.useState)(!1),g=Object(m.a)(h,2),v=g[0],O=g[1],j=Object(n.useContext)(s.a),y=j.history,N=j.setRefreshNavTimes,S=a.children.map((function(t,a){return c.a.createElement(e,{item:t,index:a,key:a,activeNavIDs:l,canWrite:o})})),k=Object(n.useCallback)((function(e){b((function(e){return!e}))}),[]);Object(n.useEffect)((function(){var e=l.indexOf(a.id)>=0;e!==v&&O(e)}),[l,v,a.id]);var w=Object(n.useCallback)((function(e){e.stopPropagation(),e.preventDefault();var t={parent:a.id,group:a.group};E.a.Post("/api/v1/docs/article/create",{},{data:t}).then((function(e){if(e.id>0){N((function(e){return e+1}));var t="/docs/article/".concat(e.id);y.push(t)}else console.log("\u521b\u5efa\u6587\u7ae0\u5931\u8d25")})).catch((function(e){console.log(e)}))}),[y,a,N]);return c.a.createElement("div",{key:r,className:"nav"},c.a.createElement("div",{className:"item"},c.a.createElement(i.c,{to:"/docs/article/".concat(a.id),activeClassName:"active"},c.a.createElement("div",{className:"title",style:{paddingLeft:12*a.level},onClick:k},S.length>0&&c.a.createElement(d.a,{type:p||v?"caret-down":"caret-right"}),a.title?a.title:c.a.createElement("span",{className:"no-title"},"\u65e0\u6807\u9898"),o&&c.a.createElement("div",{className:"add",onClick:w},c.a.createElement(d.a,{type:"plus-square-o"})))),S.length>0&&c.a.createElement("div",{className:p||v?"children active":"children"},S)))},G=function(e){var t=e.group,a=Object(n.useState)(null),r=Object(m.a)(a,2),l=r[0],i=r[1],o=Object(n.useContext)(s.a),u=o.navData,f=o.refreshNavTimes,d=o.currentArticleGroupID,p=o.groupPermissions,b=o.setGroupPermissions,h=Object(n.useState)([]),g=Object(m.a)(h,2),v=g[0],O=g[1],j=Object(n.useState)(0),y=Object(m.a)(j,2),N=y[0],S=y[1],k=Object(n.useState)(!1),w=Object(m.a)(k,2),C=w[0],x=w[1],I=Object(n.useCallback)((function(e,t){if(i(e),t&&S((function(e){return e++})),e){var a="/api/v1/docs/article/all?group=".concat(e);E.a.Get(a,{},{}).then((function(e){Array.isArray(e)?O(e):T.a.warn("\u83b7\u53d6\u6587\u7ae0\u5217\u8868\u6570\u636e\u51fa\u9519:"+JSON.stringify(e))})).catch((function(e){console.log(e)}))}}),[]),L=Object(n.useMemo)((function(){var e=[];return u.forEach((function(t){t.id&&t.id>0&&e.push(t.id)})),e}),[u]);Object(n.useEffect)((function(){t!==l?I(t):f>0&&N<=f&&I(t,!0)}),[l,t,I,N,f]);var P=Object(n.useCallback)((function(e){var t="/api/v1/docs/group/".concat(e,"/permissions");E.a.Get(t,{},{}).then((function(e){Array.isArray(e)&&b(e)})).catch((function(e){console.log(e)}))}),[b]);Object(n.useEffect)((function(){d>0&&P(d)}),[d,P]),Object(n.useEffect)((function(){p.indexOf("write")>=0?x(!0):x(!1)}),[p]);var D;return D=v.map((function(e,t){return c.a.createElement(K,{item:e,index:t,key:t,activeNavIDs:L,canWrite:C})})),c.a.createElement("div",{className:"articles"},D)};var z=function(e){var t=e.showLeftSider,a=e.setShowLeftSider,r=Object(n.useState)([]),l=Object(m.a)(r,2),o=l[0],p=l[1],b=Object(n.useState)({}),h=Object(m.a)(b,2),g=h[0],v=h[1],O=Object(n.useContext)(s.a),j=O.setRefreshNavTimes,y=O.history,N=O.currentArticleGroupID,w=O.setCurrentArticleGroupID,C=Object(n.useMemo)((function(){var e=localStorage.getItem("leftSiderWidth"),t=parseInt(e);return t&&t>=156&&t<=460?t:200}),[]),x=Object(n.useState)(C),I=Object(m.a)(x,2),L=I[0],P=I[1],D=Object(n.useCallback)((function(){E.a.Get("/api/v1/docs/group/all").then((function(e){Array.isArray(e)?p(e):T.a.warn("\u83b7\u53d6\u5206\u7ec4\u5217\u8868\u6570\u636e\u51fa\u9519",3)})).catch((function(e){console.log(e)}))}),[p]);Object(n.useEffect)((function(){return 0===o.length&&D(),function(){localStorage.setItem("leftSiderWidth",L)}}),[o.length,D,L]),Object(n.useEffect)((function(){if(N&&N>0){if(!g.id||g.id!==N)for(var e=0;e<o.length;e++)if(o[e].id===N){w(o[e].id),v(o[e]);break}}else o.length>0&&v(o[0])}),[o,N,g.id,w]);var M=Object(n.useCallback)((function(e,t){t.element;var a=t.size;a.width<156?P(156):a.width<=460?P(a.width):P(460)}),[P]),A=Object(n.useMemo)((function(){var e=o.map((function(e,t){return c.a.createElement(k.a.Item,{key:t,onClick:function(t){document.title="\u770b\u677f-\u5206\u7c7b-".concat(e.name),w(e.id)}},e.name)}));return c.a.createElement(k.a,{className:"categories-list"},e)}),[o,w]),R=Object(n.useCallback)((function(e){e.preventDefault(),a((function(e){return localStorage.setItem("showLeftSider",!e),!e}))}),[a]),K=Object(n.useMemo)((function(){return t?c.a.createElement(G,{group:g.id}):null}),[g.id,t]),z=Object(n.useCallback)((function(e){if(e.stopPropagation(),g.id<0)T.a.warn("\u8fd8\u672a\u9009\u62e9\u5206\u7c7b\uff0c\u4e0d\u53ef\u521b\u5efa\u6587\u7ae0",3);else{E.a.Post("/api/v1/docs/article/create",{},{data:{group:g.id}}).then((function(e){e.id>0?(T.a.success("\u6dfb\u52a0\u6587\u7ae0\u6210\u529f"),j((function(e){return e+1})),y.push("/docs/article/".concat(e.id))):T.a.warn(JSON.stringify(e))})).catch((function(e){console.log(e)}))}}),[g.id,y,j]);return c.a.createElement(f.Resizable,{className:"box",axis:"x",height:0,width:L,onResize:M},c.a.createElement(u.a.Sider,{style:{height:"100vh"},width:L},c.a.createElement("div",{className:"left-sider"},c.a.createElement("div",{className:"header"},c.a.createElement("div",{className:"logo"},c.a.createElement(i.b,{to:"/"},c.a.createElement("img",{alt:"logo",src:"/static/image/logo-kanban.svg"})),c.a.createElement("div",{className:"toogle",onClick:R},c.a.createElement(d.a,{type:"angle-double-left",noMarginRight:!0})),c.a.createElement("div",{className:"clear"})),c.a.createElement("div",{className:"clear"}),c.a.createElement("div",{className:"namespace"},c.a.createElement(S.a,{overlay:A,trigger:["click"]},c.a.createElement("div",null,c.a.createElement("span",{style:{color:"red"}},c.a.createElement(d.a,{type:"flag"})),c.a.createElement("div",{className:"current"},g.name),c.a.createElement(d.a,{type:"arrows-v"}))))),c.a.createElement("div",{className:"content"},t&&K),c.a.createElement("div",{className:"footer",onClick:z},c.a.createElement("div",{className:"add"},c.a.createElement(d.a,{type:"plus"}),"\u65b0\u7684\u6587\u7ae0")))))},F=Object(v.a)((function(){return a.e(5).then(a.bind(null,1276))})),_=Object(v.a)((function(){return Promise.all([a.e(0),a.e(3),a.e(17),a.e(19)]).then(a.bind(null,1245))})),q=Object(v.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(3),a.e(2),a.e(11)]).then(a.bind(null,1280))}));var W=function(e){var t=Object(n.useState)("align-justify"),a=Object(m.a)(t,2),r=a[0],l=a[1],i=Object(n.useContext)(s.a).navData,u=Object(n.useCallback)((function(t){t.preventDefault(),e.setShowLeftSider((function(e){return localStorage.setItem("showLeftSider",!e),!e}))}),[e]);return c.a.createElement("div",{className:"right-content"},c.a.createElement("div",{className:"header"},c.a.createElement("div",{className:"toogle",onClick:u,onMouseEnter:function(e){l("angle-double-right")},onMouseLeave:function(e){l("align-justify")},style:{display:e.showLeftSider?"none":"inline-block"}},c.a.createElement(d.a,{type:r})),c.a.createElement(j,{data:i}),c.a.createElement("div",{className:"right"},c.a.createElement(N,{history:e.history}),c.a.createElement("div",{className:"user"},c.a.createElement(w,null)))),c.a.createElement("div",{className:"container"},c.a.createElement(o.d,null,c.a.createElement(o.b,Object.assign({path:"/",exact:!0,component:_},e)),c.a.createElement(o.b,Object.assign({path:"/docs/article/:id",component:q},e)))),c.a.createElement(F,null))};var J=function(e){var t,a=Object(n.useState)(!1),r=Object(m.a)(a,2),l=r[0],i=r[1],o=Object(n.useState)(null),f=Object(m.a)(o,2),d=f[0],p=f[1],E=Object(n.useState)([]),b=Object(m.a)(E,2),h=b[0],g=b[1],v=Object(n.useState)(0),O=Object(m.a)(v,2),j=O[0],y=O[1],N=Object(n.useState)([{title:"\u9996\u9875",icon:"home",link:"/"}]),S=Object(m.a)(N,2),k=S[0],w=S[1];return Object(n.useEffect)((function(){var t=localStorage.getItem("showLeftSider");null!==t?(t!==l.toString()&&i("true"===t),"/"===e.location.pathname&&(document.title="\u770b\u677f-\u9996\u9875",k.length>1&&w([{title:"\u9996\u9875",icon:"home",link:"/"}]))):i(!0)}),[k.length,e.location.pathname,l]),l&&(t=c.a.createElement(z,{showLeftSider:l,setShowLeftSider:i,refreshNavTimes:j})),c.a.createElement(s.a.Provider,{value:{navData:k,setNavData:w,history:e.history,refreshNavTimes:j,setRefreshNavTimes:y,currentArticleGroupID:d,setCurrentArticleGroupID:p,groupPermissions:h,setGroupPermissions:g}},c.a.createElement(u.a,{className:"left-right-layout"},t,c.a.createElement(u.a,null,c.a.createElement(u.a.Content,null,c.a.createElement(W,Object.assign({},e,{showLeftSider:l,setShowLeftSider:i}))))))},U=(a(143),a(53)),B=(a(144),a(37)),H=(a(74),a(12)),V=(a(151),a(28)),Q=a(150),X=V.a.Item,Y=function(e){var t=Object(n.useMemo)((function(){return c.a.createRef()}),[]),a=Object(n.useCallback)((function(t){E.a.Post("/api/v1/account/login",{},{headers:{"Content-Type":"application/json",Accept:"application/json"},data:t}).then((function(t){if("success"===t.status||!0===t.status){var a=new Q.a(e.location.search).get("next","/");if((!a||"string"===typeof a&&a.indexOf("/user/login")>=0)&&(a="/"),"string"===typeof a&&a.startsWith("http"))window.location.href=a;else{var n=window.location.origin;"string"===typeof a&&(n=window.location.origin+a),window.location.href=n}}else T.a.error("\u767b\u9646\u5931\u8d25:"+t.message,5)})).catch((function(e){console.log(e),400!==e.status&&403!==e.status||(e.data&&e.data.message?T.a.warn(e.data.message,5):T.a.err(JSON.stringify(e.data),5))}))}),[e.location.search]);return Object(n.useEffect)((function(){localStorage.reFreshPathname=null}),[]),c.a.createElement(u.a,{className:"container"},c.a.createElement(U.a,{className:"login"},c.a.createElement(B.a,{xs:{span:20,offset:2},lg:{span:6,offset:9}},c.a.createElement("div",{className:"logo"},c.a.createElement("img",{src:"/static/image/logo-kanban.svg",alt:"Logo"})),c.a.createElement(V.a,{ref:t,onFinish:a,name:"baseForm",className:"login-form"},c.a.createElement(X,{name:"username",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"user"}),placeholder:"username"})),c.a.createElement(X,{name:"password",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"lock"}),size:"large",type:"password",placeholder:"password"})),c.a.createElement(X,null,c.a.createElement(H.a,{type:"primary",htmlType:"submit",className:"login-form-button",style:{width:"100%"}},"\u767b\u5f55")),c.a.createElement(X,null,c.a.createElement(U.a,null,c.a.createElement(B.a,{span:12,className:"login-form-change"},c.a.createElement(i.b,{to:""},"\u4fee\u6539\u5bc6\u7801")),c.a.createElement(B.a,{span:12,className:"login-form-forget"},c.a.createElement(i.b,{to:"/user/signup"},"\u6ce8\u518c"))))))))},Z=(a(169),a(100)),$=function(e){var t=Object(n.useState)({}),a=Object(m.a)(t,2),r=a[0],l=a[1],o=Object(n.useState)(!1),s=Object(m.a)(o,2),u=s[0],f=s[1],p=Object(n.useMemo)((function(){return c.a.createRef()}),[]),b=Object(n.useCallback)((function(e){console.log(e);E.a.Post("/api/v1/account/user/create",{},{headers:{"Content-Type":"application/json",Accept:"application/json"},data:e}).then((function(e){e.id>0?(l(e),f(!0)):T.a.warn(JSON.stringify(e),5)})).catch((function(e){console.log(e),400===e.status&&T.a.error(JSON.stringify(e.data),5)}))}),[]);return Object(n.useEffect)((function(){p.current.setFieldsValue({})}),[p]),u?c.a.createElement("div",{classname:"container"},c.a.createElement(Z.a,{status:"success",title:"\u8d26\u53f7\u6ce8\u518c\u6210\u529f!",subTitle:"\u60a8\u597d\uff01".concat(r.username,", \u8bf7\u70b9\u51fb\u767b\u5f55\uff01"),extra:[c.a.createElement(i.b,{to:"/"},c.a.createElement(H.a,{key:"index"},"\u9996\u9875")),c.a.createElement(i.b,{to:"/user/login"},c.a.createElement(H.a,{type:"primary",key:"login"},"\u767b\u5f55"))]})):c.a.createElement("div",{className:"container"},c.a.createElement(U.a,{className:"signup"},c.a.createElement(B.a,{xs:{span:20,offset:2},lg:{span:6,offset:9}},c.a.createElement("div",{className:"logo"},c.a.createElement("img",{src:"/static/image/logo-kanban.svg",alt:"Logo"})),c.a.createElement(V.a,{ref:p,onFinish:b,name:"baseForm",className:"login-form"},c.a.createElement(V.a.Item,{name:"mobile",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"mobile"}),size:"large",type:"text",placeholder:"\u624b\u673a\u53f7"})),c.a.createElement(V.a.Item,{name:"username",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"user"}),placeholder:"username",allowClear:!0})),c.a.createElement(V.a.Item,{name:"password",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"lock"}),size:"large",type:"password",placeholder:"\u767b\u5f55\u5bc6\u7801",allowClear:!0})),c.a.createElement(V.a.Item,{name:"re_password",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801"}]},c.a.createElement(y.a,{prefix:c.a.createElement(d.a,{type:"lock"}),size:"large",type:"password",placeholder:"\u91cd\u590d\u5bc6\u7801"})),c.a.createElement(V.a.Item,null,c.a.createElement(H.a,{type:"primary",htmlType:"submit",className:"login-form-button",style:{width:"100%"}},"\u6ce8\u518c")),c.a.createElement(V.a.Item,null,c.a.createElement(U.a,null,c.a.createElement(B.a,{span:12,className:"login-form-change"},c.a.createElement(i.b,{to:""},"\u4fee\u6539\u5bc6\u7801")),c.a.createElement(B.a,{span:12,className:"login-form-forget"},c.a.createElement(i.b,{to:"/user/login"},"\u767b\u5f55"))))))))};var ee=function(e){var t=Object(n.useState)(!1),a=Object(m.a)(t,2),r=a[0],l=a[1];return Object(n.useEffect)((function(){var t,a=e.history.location.pathname;try{t=window.localStorage.reFreshPathname,window.localStorage.reFreshPathname=a}catch(n){t=a}a!==t?window.location.reload():l(!0)}),[e,r]),c.a.createElement("div",null,r?c.a.createElement(Z.a,{status:"404",title:"404",subTitle:"Sorry, \u60a8\u8981\u8bbf\u95ee\u7684\u9875\u9762\u4e0d\u5b58\u5728.",extra:c.a.createElement(i.b,{to:"/"},c.a.createElement(H.a,{type:"primary"},"\u8fd4\u56de\u9996\u9875"))}):null)};var te=function(e){return c.a.createElement(s.b.Provider,null,c.a.createElement(i.a,null,c.a.createElement(o.d,null,c.a.createElement(o.b,{exact:!0,path:"/user/login",component:Y}),c.a.createElement(o.b,{exact:!0,path:"/user/signup",component:$}),c.a.createElement(o.b,{exact:!0,path:"/",component:J}),c.a.createElement(o.b,{path:"/docs/article/list",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/docs"},e))}}),c.a.createElement(o.b,{path:"/docs/article",render:function(e){return c.a.createElement(J,Object.assign({defaultOpenKey:"/docs"},e))}}),c.a.createElement(o.b,{path:"/docs",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/docs"},e))}}),c.a.createElement(o.b,{path:"/tags",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/tags"},e))}}),c.a.createElement(o.b,{path:"/tools",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/tools"},e))}}),c.a.createElement(o.b,{path:"/user",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/user"},e))}}),c.a.createElement(o.b,{path:"/config",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/config"},e))}}),c.a.createElement(o.b,{path:"/test",render:function(e){return c.a.createElement(R,Object.assign({defaultOpenKey:"/test"},e))}}),c.a.createElement(o.b,{component:ee}))))};a(407),a(408);l.a.render(c.a.createElement(te,null),document.getElementById("root"))}},[[240,7,9]]]);
//# sourceMappingURL=main.455bcacc.chunk.js.map