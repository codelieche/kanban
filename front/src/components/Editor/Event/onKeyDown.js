/**
 * 处理键盘按键事件
 */
import { Editor, Transforms } from "slate";

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
    // console.log(event, editor);
    if(!event.ctrlKey){
        // 未按下ctrl键
        if(event.key === "Enter"){
            // 获取锚点
            const { anchor } = editor.selection;
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = {anchor, focus: start}
            const beforeText = Editor.string(editor, range);

            console.log("前面的内容是：", beforeText);
            console.log("path:", path, block)

            if(beforeText === "" && path.length > 1){
                editor.insertBreak();

                Transforms.delete(editor, block);

                Transforms.setNodes(editor, 
                    {type: "paragraph"}, 
                    // {match: n => n.type ? n.type !== "paragraph" : false, split: true}
                    {match: n => n, split: true}
                );

                // 提升节点
                try {
                    if(path.length > 1){
                        Transforms.liftNodes(editor, {split: true});
                    }
                } catch (error) {
                    console.log(path);
                    console.log(error);
                }
                event.preventDefault();
            }
        }
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