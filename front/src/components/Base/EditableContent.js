/**
 * EditableContent
 * 可以编辑的组件
 */
import React, {useState, useCallback, useMemo, useEffect} from "react";

export const EditableContent = function(props) {
    // 最新的的innerHTML值
    const [ latestHtml, setLatestHtml ] = useState("");
    // 如果组件中的内容被变更了，那么就设置contentUpdated为true
    const [contentUpdated, setContentUpdated] = useState(false);

    // let element = props.innerRef ? props.innerRef : React.createRef();
    let [elementRef, setElementRef] = useState(React.createRef());

    const getElement = useCallback(() => {
        if(props.innerRef && typeof props.innerRef !== "function"){
            return props.innerRef.current
        }else{
            return elementRef.current;
        }
    }, [elementRef, props.innerRef])

    const handleContentUpdatedFunction = useCallback(() => {
        // console.log("exec function handleContentUpdated");
        // 处理组件内容变更后续的操作
        // 当组件鼠标移开，不获取焦点的时候，组件卸载的时候都需要执行一下
        // 当页面要跳转到其它页面的时候，也会触发 onBlur事件的
        try {
            if(contentUpdated){
                const element = getElement();
                // console.log(originalEvt);
                if(!element){
                    return;
                }
                // 获取元素中当前的html
                const html = element.innerHTML;
                // console.log(element.innerText);
                const text = element.innerText;
    
                if(props.handleContentUpdated && typeof props.handleContentUpdated === "function"){
                    props.handleContentUpdated({
                        html,
                        text,
                    });
                    // 设置contentUpdated为fasle
                    setContentUpdated(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
        
    }, [contentUpdated, getElement, props])

    useEffect(() => {
        if(props.innerRef && typeof props.innerRef === "function" && props.innerRef !== elementRef){
            setElementRef(props.innerRef)
        }
        // 组件被销毁的时候要如果内容更新了就需要执行一些update的操作
        // return () => {
        //     if(contentUpdated){
        //         // 我被更新了哦
        //         // console.log("我有更新");
        //         // handleContentUpdatedFunction()
        //     }
        // }
    }, [contentUpdated, elementRef, handleContentUpdatedFunction, props.innerRef])
    
    const emitChange = useCallback((originalEvt) => {
        // 获取当前的元素
        const element = getElement();
        // console.log(originalEvt);

        if(!element){
            return;
        }

        // 获取元素中当前的html
        const html = element.innerHTML;
        // console.log(element.innerText);

        if(html !== latestHtml && !contentUpdated){
            setContentUpdated(true);
        }

        if(props.onChange && html !== latestHtml){
            const event = Object.assign({}, originalEvt, {
                target: {
                    value: html,
                    text: element.innerText
                }
            });
            props.onChange(event);
        }

        // 设置最新的html
        setLatestHtml(html);

    }, [contentUpdated, getElement, latestHtml, props]);


    const currentElement = useMemo(() => {
        const { tagName, content, contentType, handleContentUpdated, innerRef, ...other} = props;
        if(contentType && contentType !== "text"){
            // 默认方式是设置html
            return React.createElement(
                // 标签
                tagName || "div",
                // 属性
                {
                    ...other,
                    ref: elementRef,
                    onInput: emitChange,
                    onBlur: props.onBlur || emitChange,
                    onMouseLeave: props.onMouseLeave || handleContentUpdatedFunction,
                    onKeyUp: props.onKeyUp || emitChange,
                    onKeyDown: props.onKeyDown || emitChange,
                    contentEditable: !props.disabled,
                    suppressContentEditableWarning: true,
                    dangerouslySetInnerHTML: { __html: content }
                },
                // 子组件: 因为设置dangerouslySetInnerHTML和children是冲突的
                // props.children
            );
        }else{
            // 如果props.contentType是text，那么把content当children使用
            return React.createElement(
                // 标签
                tagName || "div",
                // 属性
                {
                    ...other,
                    ref: elementRef,
                    onInput: emitChange,
                    onBlur: props.onBlur || emitChange,
                    onMouseLeave: props.onMouseLeave || handleContentUpdatedFunction,
                    onKeyUp: props.onKeyUp || emitChange,
                    onKeyDown: props.onKeyDown || emitChange,
                    contentEditable: !props.disabled,
                    suppressContentEditableWarning: true,
                    // 设置下样式：让换行符可以显示出来
                    style: props.style ? props.style : {whiteSpace: "pre-wrap"},
                    // dangerouslySetInnerHTML: { __html: content }
                },
                // 子组件: 因为设置dangerouslySetInnerHTML和children是冲突的
                // props.children
                content
            );
        }
    }, [elementRef, emitChange, handleContentUpdatedFunction, props])
    return currentElement;
};

export default EditableContent;