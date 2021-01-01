/**
 * 监听鼠标事件
 */

 export const onKeyDown = (e) => {
     console.log(e);

     var keyNumber = window.envet ? e.keyCode : e.which;

     console.log(keyNumber);

    //  document.onkeydown = onKeyDown;
 }

 export default onKeyDown;
