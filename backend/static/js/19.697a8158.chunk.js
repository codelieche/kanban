(this.webpackJsonpkanban=this.webpackJsonpkanban||[]).push([[19],{1246:function(e,a,t){"use strict";t.r(a);t(84);var c=t(29),n=(t(87),t(17)),l=t(0),s=t.n(l),r=t(5),i=t(4),o=t(16),u=(t(217),t(89)),m=(t(726),t(1241)),d=t(3),f=t(11),b=t(513),E=function(e){var a=Object(l.useState)([]),t=Object(d.a)(a,2),o=t[0],E=t[1],v=Object(l.useState)(!1),p=Object(d.a)(v,2),g=p[0],j=p[1],O=Object(l.useState)(!1),N=Object(d.a)(O,2),h=N[0],k=N[1],y=Object(l.useCallback)((function(){if(!g){j(!0);f.a.Get("/api/v1/docs/group/list").then((function(e){var a=e.results;a instanceof Array?(E(a),k(!0)):(k(!0),E([]))})).catch((function(e){console.log(e),j(!1)}))}}),[]);Object(l.useEffect)((function(){0!==o.length||h||y()}),[o.length,y,h]);var C=Object(l.useMemo)((function(){return o.map((function(e,a){return s.a.createElement(n.a,{xs:{span:24},sm:{span:12},md:{span:12},lg:{span:8},className:"info-item",key:a},s.a.createElement(m.a,{title:e.name,bordered:!0},s.a.createElement("div",{className:"info"},s.a.createElement("div",{className:"row"},s.a.createElement("span",{className:"config"},"\u540d\u79f0:"),s.a.createElement("span",{className:"value"},s.a.createElement(r.b,{to:"/docs/group/".concat(e.id)},e.name))),s.a.createElement("div",{className:"row"},s.a.createElement("span",{className:"config"},"\u4ee3\u7801:"),s.a.createElement("span",{className:"value"},e.code))),s.a.createElement("div",{className:"buttons"},s.a.createElement("div",{className:"button"},s.a.createElement(r.b,{to:"/docs/group/".concat(e.id)},"\u67e5\u770b\u8be6\u60c5")),s.a.createElement("div",{className:"button"},s.a.createElement(r.b,{to:"/docs/group/".concat(e.id,"/articles")},"\u67e5\u770b\u6587\u7ae0")))))}))}),[o]);return h?0===o.length?s.a.createElement("div",{className:"no-content border"},"\u60a8\u8fd8\u6ca1\u6709\u4efb\u4f55\u5de5\u4f5c\u533a\u4fe1\u606f"):s.a.createElement("div",{className:"usercenter position-relative"},s.a.createElement(c.a,{gutter:8},C),s.a.createElement("div",{className:"add bottom-right"},s.a.createElement(r.b,{to:"/docs/group/add"},s.a.createElement(u.a,{title:"\u6dfb\u52a0\u5de5\u4f5c\u7ec4",placement:"bottom"},s.a.createElement("div",null,s.a.createElement(i.a,{type:"plus",noMarginRight:!0})))))):s.a.createElement("div",{className:"usercenter"},s.a.createElement(b.a,null))},v=(t(431),t(433)),p=(t(427),t(428)),g=(t(54),t(10)),j=t(438),O=t(446),N=function(e){var a=Object(l.useState)(0),t=Object(d.a)(a,2),c=t[0],n=t[1],i=Object(l.useState)([{name:"\u5168\u90e8",id:0}]),o=Object(d.a)(i,2),u=o[0],m=o[1],b=Object(l.useState)([]),E=Object(d.a)(b,2),N=E[0],h=E[1],k=Object(l.useState)(!0),y=Object(d.a)(k,2),C=y[0],S=y[1],_=Object(l.useCallback)((function(){f.a.Get("/api/v1/docs/group/all",{},{}).then((function(e){Array.isArray(e)?m([{name:"\u5168\u90e8",id:0}].concat(Object(j.a)(e))):g.a.warn(JSON.stringify(e),5)})).catch((function(e){console.log(e),g.a.error("\u83b7\u53d6\u5206\u7ec4\u5217\u8868\u51fa\u9519\uff01",5)}))}),[]),w=Object(l.useCallback)((function(e){var a="/api/v1/docs/article/list?ordering=-time_added";S(!0),e>0&&(a="".concat(a,"&group=").concat(e)),f.a.Get(a,{},{}).then((function(e){S(!1);var a=e.results;Array.isArray(a)?h(a):g.a.warn(JSON.stringify(e),5)})).catch((function(e){console.log(e),S(!1)}))}),[]);Object(l.useEffect)((function(){_()}),[_,w]),Object(l.useEffect)((function(){w(c)}),[c,w]);var A=Object(l.useMemo)((function(){return u.map((function(e,a){return s.a.createElement(p.a.CheckableTag,{checked:c===e.id,onChange:function(){return n(e.id)},key:e.id},e.name)}))}),[c,u]),D=Object(l.useMemo)((function(){return N.map((function(e,a){return s.a.createElement("div",{className:"article-item",key:e.id},e.cover&&s.a.createElement(r.b,{to:"/docs/article/".concat(e.id)},s.a.createElement("div",{className:"cover"},s.a.createElement("img",{src:e.cover,alt:"\u5c01\u9762"}))),s.a.createElement("div",{className:"content"},s.a.createElement("div",{className:"title"},s.a.createElement(r.b,{to:"/docs/article/".concat(e.id)},s.a.createElement("h2",null,e.title))),s.a.createElement("div",{className:"metadata"},s.a.createElement(O.b,{appLabel:"docs",model:"article",objectID:e.id}),s.a.createElement("span",{className:"item"},"\u65f6\u95f4: ",e.time_added),s.a.createElement("span",{className:"item"},"\u4f5c\u8005: ",e.user)),!!e.description&&s.a.createElement("div",{className:"description"},e.description)))}))}),[N]);return s.a.createElement("div",{className:"articles"},s.a.createElement("div",{className:"tags-list border-bottom"},s.a.createElement("div",{className:"list"},A)),s.a.createElement(v.a,{spinning:C},s.a.createElement("div",{className:"articles-list"},D)))},h=(t(602),t(709)),k=(t(728),t(1244)),y=function(e){var a=Object(l.useState)({}),t=Object(d.a)(a,2),c=t[0],n=t[1];Object(l.useEffect)((function(){e.data===c||c.id||n(e.data)}),[c,e.data]);var r,i=Object(l.useCallback)((function(e){if(e){var a="/api/v1/account/message/"+e;f.a.Get(a).then((function(e){})).catch((function(e){console.log(e)}))}}),[]),o=Object(l.useCallback)((function(){var e,a=c;return a.link&&(e=s.a.createElement("a",{href:a.link},"\u67e5\u770b\u8be6\u60c5")),s.a.createElement("div",{className:"message"},s.a.createElement("div",{className:"meta"},s.a.createElement("span",{className:"meta-item"},"\u6d88\u606f\u7c7b\u578b:",a.scope),s.a.createElement("span",{className:"meta-item"},"\u53d1\u9001\u65f6\u95f4:",a.time_added)),s.a.createElement("div",{className:"content"},a.content,e))}),[c]),u=Object(l.useCallback)((function(){c.unread&&(i(c.id),n((function(e){return e.unread=!1,e})));var e={message:c.title,description:o(),duration:4,top:45};k.a.open(e)}),[c.id,c.title,c.unread,i,o]);return r=c.unread?s.a.createElement(h.a,{status:"default",color:"cyan"}):s.a.createElement(h.a,{status:"default",color:"#dfdfdf"}),s.a.createElement("div",{className:"item",onClick:u},r,c.title)},C=function(e){var a,t,c=Object(l.useState)(!1),n=Object(d.a)(c,2),i=n[0],u=n[1],m=Object(l.useState)([]),b=Object(d.a)(m,2),E=b[0],v=b[1],p=Object(l.useContext)(o.a).history,g=Object(l.useCallback)((function(){f.a.Get("/api/v1/account/message/list").then((function(e){var a=e.results;if(a instanceof Array){var t=!!e.next;u(t),v(a)}}))}),[]);Object(l.useEffect)((function(){0===E.length&&g()}),[g,E.length]),a=E.map((function(e,a){return s.a.createElement(y,{data:e,key:a,history:p})}));var j=Object(l.useMemo)((function(){return i?s.a.createElement("div",{className:"more"},s.a.createElement(r.b,{className:"",to:"/user/message/all"},"\u67e5\u770b\u66f4\u591a")):null}),[i]);return t=a.length>0?s.a.createElement("div",{className:"inner"},s.a.createElement("ul",{className:"list"},a),j):s.a.createElement("div",{className:"no-content"},"\u6682\u65e0\u6d88\u606f"),s.a.createElement("div",{className:"panel"},s.a.createElement("div",{className:"header"},"\u6d88\u606f\u5217\u8868"),t)};t.d(a,"UserCenterIndex",(function(){return S}));var S=function(e){var a=Object(l.useContext)(o.a).setNavData;return Object(l.useEffect)((function(){a([{title:"\u9996\u9875",icon:"home",link:"/"},{title:"\u7528\u6237\u4e2d\u5fc3"}])}),[a]),s.a.createElement(c.a,{className:"content"},s.a.createElement(n.a,{xs:{span:24},sm:{span:24},md:{span:16},lg:{span:18},className:"main"},s.a.createElement("div",{className:"title position-relative"},s.a.createElement("h4",null,"\u5de5\u4f5c\u533a"),s.a.createElement("div",{className:"right"},s.a.createElement(r.b,{to:"/docs/group/list"},"more ",s.a.createElement(i.a,{type:"angle-double-right"})))),s.a.createElement("div",null,s.a.createElement(E,e)),s.a.createElement("div",{className:"latest-articles"},s.a.createElement("div",{className:"title"},s.a.createElement("h4",null,"\u6700\u65b0\u6587\u7ae0")),s.a.createElement(N,null))),s.a.createElement(n.a,{xs:{span:24},sm:{span:24},md:{span:16},lg:{span:6},className:"sidebar"},s.a.createElement(C,null)))};a.default=S},446:function(e,a,t){"use strict";t.d(a,"c",(function(){return f})),t.d(a,"a",(function(){return b})),t.d(a,"b",(function(){return E}));t(427);var c=t(428),n=(t(86),t(15)),l=t(3),s=(t(54),t(10)),r=t(0),i=t.n(r),o=t(5),u=t(4),m=t(11),d=function(e,a,t){var c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,n=arguments.length>4?arguments[4]:void 0,l="/api/v1/tags/objecttag/list?app_label=".concat(e,"&model=").concat(a,"&object_id=").concat(t,"&page=").concat(c);t?m.a.Get(l,{},{}).then((function(e){var a=e.results;Array.isArray(a)&&n&&n(a)})).catch((function(e){console.log(e)})):s.a.warn("\u83b7\u53d6\u6807\u7b7e\uff0c\u4f20\u9012\u7684objectID\u4e3a\u7a7a",3)},f=function(e,a){var t="/api/v1/tags/objecttag/".concat(e);m.a.Delete(t,{},{}).then((function(e){204===e.status?(s.a.info("\u5220\u9664\u6807\u7b7e\u6210\u529f"),a&&a()):(console.log(e),s.a.warn(JSON.stringify(e.data)))})).catch((function(e){console.log(e)}))},b=function(e){var a=e.tagKey,t=e.appLabel,o=e.model,d=e.objectID,f=e.callback,b=Object(r.useState)(!1),E=Object(l.a)(b,2),v=E[0],p=E[1],g=Object(r.useState)(""),j=Object(l.a)(g,2),O=j[0],N=j[1],h=Object(r.useCallback)((function(){p(!0)}),[]),k=Object(r.useCallback)((function(e){N(e.target.value)}),[]),y=Object(r.useCallback)((function(e){if(e){var c={app_label:t,model:o,key:a,value:e,object_id:d};m.a.Post("/api/v1/tags/objecttag/create",{},{data:c}).then((function(e){e.id>0?(s.a.success("\u6dfb\u52a0\u6807\u7b7e\u6210\u529f",3),"function"===typeof f&&f(e)):s.a.warn(JSON.stringify(e))})).catch((function(e){console.log(e),e.data&&s.a.error(JSON.stringify(e.data))}))}else s.a.warn("\u4f20\u9012\u7684\u6807\u7b7e\u7eb8\u4e3a\u7a7a")}),[t,f,o,d,a]),C=Object(r.useCallback)((function(e){p(!1),N(""),O&&y(O)}),[y,O]),S=Object(r.useMemo)((function(){return i.a.createElement(n.a,{size:"small",className:"tag-input",value:O,onChange:k,onBlur:C,onPressEnter:C,placeholder:"\u65b0\u7684\u6807\u7b7e"})}),[k,C,O]);return v?S:i.a.createElement(c.a,{className:"tag-plus",onClick:h},i.a.createElement(u.a,{type:"plus"}),"\u6dfb\u52a0\u6807\u7b7e")},E=function(e){var a=e.appLabel,t=e.model,c=e.objectID,n=(e.showAll,e.callback),s=e.canDelete,o=e.color,u=e.reFreshTimes,m=e.filterPageUrl,f=Object(r.useState)([]),b=Object(l.a)(f,2),E=b[0],p=b[1],g=Object(r.useState)(1),j=Object(l.a)(g,2),O=j[0],N=j[1],h=Object(r.useCallback)((function(e){p(e),"function"===typeof n&&n(e)}),[n]);return Object(r.useEffect)((function(){N(1)}),[a,t,c]),Object(r.useEffect)((function(){a&&t&&c&&d(a,t,c,O,h)}),[a,h,t,c,O]),Object(r.useEffect)((function(){u>0&&a&&t&&c&&d(a,t,c,O,h)}),[a,h,t,c,O,u]),i.a.createElement(v,{dataSource:E,canDelete:s,color:o,filterPageUrl:m})},v=function(e){var a=e.dataSource,t=e.canDelete,n=e.color,l=e.filterPageUrl,s=Object(r.useMemo)((function(){return a&&Array.isArray(a)?a.map((function(e,a){var s;"tag"!==e.key&&(s=i.a.createElement("span",{className:"key"},e.key," |"));var r,u=i.a.createElement(c.a,{key:e.id,color:n||"blue",closable:t,onClose:function(){return f(e.id)}},s," ",e.value);return l?(r=l.indexOf("?")>0?"".concat(l,"&tag__keys=").concat(e.key,"&tag__values=").concat(e.value):"".concat(l,"?tag__keys=").concat(e.key,"&tag__values=").concat(e.value),i.a.createElement(o.b,{to:r,key:e.id},u)):u})):null}),[a,n,t,l]);return s&&s.length>0?i.a.createElement("div",{className:"tags"},s):null}},513:function(e,a,t){"use strict";t(431);var c=t(433),n=t(0),l=t.n(n);a.a=function(e){return l.a.createElement("div",{className:"loading"},l.a.createElement("div",null,l.a.createElement(c.a,{size:e.size?e.size:"default"}),l.a.createElement("div",{className:"message"},e.message?e.message:"\u6570\u636e\u52a0\u8f7d\u4e2d...")))}}}]);
//# sourceMappingURL=19.697a8158.chunk.js.map