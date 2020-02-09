/**
 * 处理键盘按键事件
 */
import { Editor } from "slate";

export const isMarkActive = (editor, type) => {
    const marks = Editor.marks(editor)
    return marks ? marks["type"] === type : false
}

export const toggleMark = (editor, type) => {
    const isActive = isMarkActive(editor, type)

    if (isActive) {
        Editor.removeMark(editor, "type")
    } else {
        console.log(editor);
        Editor.addMark(editor, "type", type)
    }
}

export const  onKeyDownFunc = function(event, editor){
    // console.log(event);
    if(!event.ctrlKey){
        // 未按下ctrl键
    }else{
        // 按下了ctrl键
        console.log(event.key, event.keyCode);
        if(event.key === "b"){
            // 加粗
            console.log("粗体开关")
            toggleMark(editor, "bold");

        }
        if(event.key === "i"){
            // 加粗
            console.log("斜体开关")
            toggleMark(editor, "italic");

        }
    }
}

export default onKeyDownFunc;