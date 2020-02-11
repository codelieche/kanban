/**
 * 修改Editor的 inserText
 */
import { Editor, Range, Point, Transforms } from "slate";


const markdownPatterns = {
    // '*': 'list-item-ul',
    // '-': 'list-item-ul',
    // '+': 'list-item-ul',
    '>': 'quote',
    '#': 'h1',
    '##': 'h2',
    '###': 'h3',
    '####': 'h4',
    '#####': 'h5',
    '######': 'h6',
    '---': "hr",
}

// markdown的正则表达式
const markdowListRegexp = {
    "list-item-ul": /^[*\-+].?$/,
    "list-item-ol": /^\d+\.?$/,
}

const markdownRegexpValue = {
    // 匹配加粗
    "bold": /\*\*(.*?)\*\*$/,
    // 匹配代码单词
    "code": /^`(.*?)`$/,
    // 匹配图片
    "image": /!\[(.*)\]\((.*?)\)$/,
    // 匹配链接
    "link": /\[(.*)\]\((.*?)\)$/,
    // 匹配代码块
    "codeblock": /^```(.*?)\s*$/
}

export const withInsertAndDelete = editor => {

    // 先获取insertText和deleteBackward
    const {
        insertText, deleteBackward
    } = editor;

    // 修改默认的insertText
    editor.insertText = async (text) => {
        const { selection } = editor;
        // console.log(selection);
        insertText(text);
        // console.log(text);

        let pipei = false;
        // let pipeiType = "";

        // 对值做检验：输入空格后触发
        if(text === ' ' && selection && Range.isCollapsed(selection)){
            // 获取锚点
            const { anchor } = selection;
            const block = Editor.above(editor, {
                match: n => Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = Editor.start(editor, path);
            const range = {anchor, focus: start}
            // 获取到了本block前面的字符
            const beforeText = Editor.string(editor, range);
            // console.log("前面的内容是：", beforeText);

            // 获取空格前面的字符匹配到的类型
            // 1. 匹配确定的字符：
            const type = markdownPatterns[beforeText];

            // 匹配到确定的类型
            if (type) {
                Transforms.select(editor, range);
                Transforms.delete(editor);
                Transforms.setNodes(
                    editor,
                    { type: type},
                    {match: n => Editor.isBlock(editor, n)} 
                );
                
                // 是引用的话，包裹一层blockquote
                if(type === "quote"){
                    // 包裹一下
                    const list = { type: "blockquote", children: []}
                    Transforms.wrapNodes(editor, list, {
                        match: n => n.type === "quote",
                    });
                }
                // 返回:后续步骤无需执行了
                return;
            }else{
                // 2. 匹配正则表达式ul或者ol
                for(var key in markdowListRegexp){
                    let reg = markdowListRegexp[key];

                    // 判断是否匹配
                    console.log(key, reg, reg.test(beforeText), beforeText);
                    if (reg.test(beforeText)){
                        // 设置selection
                        Transforms.select(editor, range);
                        Transforms.delete(editor);
                        // 设置
                        Transforms.setNodes(
                            editor,
                            { type: key},
                            {match: n => Editor.isBlock(editor, n)} 
                        );

                        // 列表相关匹配成功
                        // 包裹一下ul/ol
                        if(key === "list-item-ul"){
                            // 包裹一下
                            const list = { type: "list-ul", children: []}
                            Transforms.wrapNodes(editor, list, {
                                match: n => n.type === "list-item-ul",
                            });
                        }

                        if(key === "list-item-ol"){
                            // 包裹一下
                            const list = { type: "list-ol", children: []}
                            Transforms.wrapNodes(editor, list, {
                                match: n => n.type === "list-item-ol",
                            });
                        }
                        // 返回无需执行后面的了
                        return;
                    }
                    console.log("继续判断后面的类型");
                };

                // 3. 匹配是否是link,image, codeblock
                for(let key in markdownRegexpValue){
                    let reg = markdownRegexpValue[key];
                    // 判断是否匹配
                    if(reg.test(beforeText)){
                        // 获取匹配的值
                        let results = beforeText.match(reg);
                        console.log(key, results);
                        if(key === "bold"){
                            // 插入粗体内容
                            console.log(range);
                            range.focus.offset = results.index;
                            Transforms.select(editor, range);
                            // Transforms.delete(editor);
                            Transforms.insertFragment(
                                editor,
                                [
                                    { type: "bold", children: [{text: results[1], type: "bold"}]},
                                    { type: "paragraph", children: [{text: " ", type: "paragraph"}]}
                                ],
                                // {match: n => Editor.isBlock(editor, n), split: true} 
                            );
                        }else if(key === "link"){
                            range.focus.offset = results.index;
                            Transforms.select(editor, range);
                            Transforms.delete(editor);
                            Transforms.insertFragment(
                                editor,
                                 [
                                    { type: "paragraph", children: [{text: results[1], url: results[2], type: "link"}]},
                                    { type: "paragraph", children: [{text: " ", type: "paragraph"}]}
                                ],
                                {match: n => true, split: true} 
                            );
                        }else if(key === "image"){
                            range.focus.offset = results.index;
                            Transforms.select(editor, range);
                            Transforms.delete(editor);
                            console.log(range);
                            Transforms.insertFragment(
                                editor,
                                 [
                                    { type: "paragraph", children: [{text: results[1], url: results[2], type: "image"}]},
                                    { type: "paragraph", children: [{text: " ", type: "paragraph"}]}
                                ],
                                {match: n => true, split: true} 
                            );
                        }else if(key === "codeblock"){
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

                            // 列表相关匹配成功
                            // 包裹一下
                            if(key === "codeblock"){
                                // 包裹一下
                                const list = { type: "codeblock", children: []}
                                Transforms.wrapNodes(editor, list, {
                                    match: n => n.type === "prev",
                                });
                            }
                            
                        }

                        // 返回，无需执行后面的内容了
                        return
                    }
                }

            }
        }else{
            // 输入的是非空格字符
        }

        // 判断是否匹配
        if(pipei){
            // 执行相关操作
        }

        // 执行默认的insertText
        // insertText(text);
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
                if(block.type !== 'prev' && block.type !== 'paragraph' && Point.equals(selection.anchor, start)){
                    Transforms.setNodes(editor, {type: "paragraph"})

                    if(block.type === "list-item-ul"){
                        Transforms.unwrapNodes(editor, {
                            match: n => n.type === "list-ul",
                            split: true,
                        });
                    }else{
                        // 引用
                        // console.log(block);
                        if(block.type === "quote" && block.children[0].text === ""){
                            Transforms.unwrapNodes(editor, {
                                match: n => n.type === "blockquote",
                                split: true,
                            });
                        }
                    }
                    return;
                }else{
                    // 提升文档
                    if(path.length > 1 && block.type !== "prev"){
                        Transforms.liftNodes(
                            editor,
                        );
                    }else{
                        
                    }
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