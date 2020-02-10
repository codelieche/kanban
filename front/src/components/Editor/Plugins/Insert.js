/**
 * 修改Editor的 inserText
 */
import { Editor, Range, Point, Transforms } from "slate";


const MarkdownPatterns = {
    '*': 'list-item',
    '-': 'list-item-ul',
    '+': 'list-item',
    '>': 'blockquote',
    '#': 'h1',
    '##': 'h2',
    '###': 'h3',
    '####': 'h4',
    '#####': 'h5',
    '######': 'h6',
    '**': "bold"
}

export const withInsertAndDelete = editor => {

    // 先获取insertText和deleteBackward
    const {
        insertText, deleteBackward
    } = editor;

    // 修改默认的insertText
    editor.insertText = (text) => {
        const { selection } = editor;
        console.log(selection);

        if(text === ' ' && selection && Range.isCollapsed(selection)){
            // 获取锚点
            const { anchor } = selection;
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = {anchor, focus: start}
            const beforeText = Editor.string(editor, range);

            console.log("前面的内容是：", beforeText);

            // 获取空格前面的字符匹配到的类型
            const type = MarkdownPatterns[beforeText];

            if (type) {
                Transforms.select(editor, range);
                Transforms.delete(editor);
                Transforms.setNodes(
                    editor,
                    { type: type},
                    {match: n => Editor.isBlock(editor, n)} 
                );

                if(type === "list-item-ul"){
                    // 包裹一下
                    const list = { type: "list-ul", children: []}
                    Transforms.wrapNodes(editor, list, {
                        match: n => n.type === "list-item-ul",
                    });
                }
                // 返回
                return;
            }
        }

        


        // 执行默认的insertText
        insertText(text);
    }

    // 修改默认的deleteBackward
    editor.deleteBackward = (...args) => {
        const { selection } = editor;
        console.log(selection);

        // 判断选择的是不是一个点，而不是区间
        if(selection && Range.isCollapsed(selection)){
            const match = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            console.log(match);

            // 根据match得到block和path
            if(match){
                const [block, path] = match;
                // 获取这个区块的开始位置：{path: Number[], offset: Number}
                const start = Editor.start(editor, path);
                console.log(block, start);

                // 判断block的类型
                if(block.type !== 'paragraph' && Point.equals(selection.anchor, start)){
                    Transforms.setNodes(editor, {type: "paragraph"})

                    if(block.type === "list-item-ul"){
                        Transforms.unwrapNodes(editor, {
                            match: n => n.type === "list-ul",
                            split: true,
                        });
                    }

                    return;
                }
            }
        }

        // 执行默认的删除操作
        deleteBackward(...args);
    }

    // 返回editor
    return editor;
}

export default withInsertAndDelete;