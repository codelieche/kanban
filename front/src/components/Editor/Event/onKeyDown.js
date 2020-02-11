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

            // console.log("前面的内容是：", beforeText);
            // console.log("path:", path, block)
            // console.log(block);
            // 判断是不是codeblock
            if(block && block[0].type === "prev"){
                // console.log("is code block")
                if(beforeText.endsWith("\n\n")){
                    editor.insertBreak();
                    return;
                }else if(beforeText !== ""){
                    // 当前block是codeblock
                    Transforms.insertText(editor, "\n");
                    event.preventDefault();
                    return;
                }
            }

            if(beforeText === "" && path.length > 1){
                editor.insertBreak();
                Transforms.delete(editor, block);
                Transforms.setNodes(editor, 
                    {type: "paragraph"}, 
                    // {match: n => n.type ? n.type !== "paragraph" : false, split: true}
                    {match: n => n, split: true}
                );
                if(block && block[0].type === "prev"){
                    Transforms.unwrapNodes(editor, {
                        match: n => n.type === "codeblock",
                        split: true,
                    });
                    return;
                }
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
            }else{
                // 判断是不是code
                let codeblockReg = /^```(.*?)\s*$/;
                if (codeblockReg.test(beforeText)){
                    event.preventDefault();

                    let results = beforeText.match(codeblockReg);
                    let selection = editor.selection;

                    // 这个是代码段
                    range.focus.offset = results.index;
                    Transforms.select(editor, range);
                    Transforms.delete(editor);
                    console.log(range, block);
                    console.log(selection.focus.path);
                    // 设置
                    let codeStr = "import os\n\nif __name__ === '__main__':\n    print(help(os))";

                    Transforms.setNodes(
                        editor,
                        { type: "prev", text: codeStr, isVoid: true},
                        {match: n => Editor.isBlock(editor, n)} 
                    );

                    // 代码匹配成功
                    // 包裹一下
                    const list = { type: "codeblock", children: []}
                    Transforms.wrapNodes(editor, list, {
                        match: n => n.type === "prev",
                    });
                }
            }
        }
    }else{
        // 按下了ctrl键
        console.log(event.key, event.keyCode);

        if(event.key === "Enter"){
            // 插入新的block
            editor.insertBreak();
            // Transforms.delete(editor);
            Transforms.insertNodes(editor, 
                {type: "paragraph", children: []}, 
                // {match: n => n.type ? n.type !== "paragraph" : false, split: true}
                {match: n => n, split: true}
            );
        }

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