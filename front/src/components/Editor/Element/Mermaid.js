/**
 * Mermaid组件显示
 */
import React, {useState, useCallback, useEffect, useMemo} from "react";

import mermaid from "mermaid";

export const MermaidElement = ({ code }) => {
    // 状态
    const [codeStr, setCodeStr] = useState("");

    const containerRef = useMemo( () => React.createRef(), [])

    useEffect(() => {
        if(!!code){
            // containerRef.current.removeAttribute("data-processed");
            setCodeStr(code);
        }
    }, [code, containerRef]);

    const initMermaid = useCallback(() => {
        // 当要解析的字符为空 的时候，直接返回，要不parse的时候会报错
        if(!codeStr){
            return
        }

        // 传入的code是可能错误的，需try catch
        try {
            mermaid.parse(codeStr)
            // Replacing special characters '<' and '>' with encoded '&lt;' and '&gt;'
            let _code = codeStr
            _code = _code.replace(/</g, '&lt;')
            _code = _code.replace(/>/g, '&gt;')

            //   console.log(_code);
            containerRef.current.innerHTML = _code
            mermaid.init(undefined, containerRef.current);
            
        } catch (err) {
            console.log(err);
        }
    }, [codeStr, containerRef])

    useEffect(() => {
        initMermaid();
    }, [initMermaid])

    // 更新
    useEffect(() => {
        if(codeStr){
            if( containerRef.current.innerHTML && containerRef.current.getAttribute("data-processed") ){
                containerRef.current.removeAttribute("data-processed");
                // containerRef.current.innerHTML = codeStr.replace('onerror=', 'onerror&equals;');
                containerRef.current.innerHTML = "";
            }
        }
        initMermaid();
    }, [codeStr, containerRef, initMermaid])

    return (
        <div className="mermaid">
            <div ref={containerRef} className="preview">
            </div>
            {/* 后续可增加一些其他功能，下载svg等功能 */}
        </div>
    )
}

export default MermaidElement;
