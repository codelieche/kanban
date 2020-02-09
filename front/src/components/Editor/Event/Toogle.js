/**
 * 快捷键相关
 */

import { Editor, Transforms, Text} from "slate";

const EventToogle = {
    checkMarkActive(editor, type){
        
    },
    
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === "bold",
            uninversal: true,
        });

        return !!match;
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === "code",
        })

        return !!match;
    },

    // 粗体开关
    toogleBoldMark(editor) {
        const isActive = EventToogle.isBoldMarkActive(editor);

        Transforms.setNodes(
            editor,
            { type: isActive ? "paragraph" : "bold"},
            // 应用到文本节点上
            // 如果锁选内容仅仅是全部文本的一部分，则拆分它们。
            { match: n => Text.isText(n), split: true}
        );
    },

    toogleCodeBlock(editor){
        // 判断当前的块是否是code块
        const isActive = EventToogle.isCodeBlockActive(editor);
        // 把当前选择的block类型设置为code
        // 如果是code块，就设置为code，如果不是就设置为code块
        Transforms.setNodes(
            editor,
            {type: isActive ? null : "code"},
            { match: n => Editor.isBlock(editor, n)}
        );
    },
}

export default EventToogle;
