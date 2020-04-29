/**
 * Mermaid组件显示
 */
import React, {useState, useCallback, useEffect, useMemo} from "react";

import mermaid from "mermaid";
import { Base64 } from 'js-base64';
import moment from "moment";

import Icon from "../../Base/Icon";
import {CopyIcon} from "../../Page/Copy";

export const MermaidElement = ({ code }) => {
    // 状态
    const [codeStr, setCodeStr] = useState("");
    const [showError, setShowError] = useState(false);
    const [showCode, setShowCode] = useState(false);

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
            if(showError){
                setShowError(false);
            }

        } catch (err) {
            // console.log(err);
            if(!showError){
                setShowError(true);
            }
        }
    }, [codeStr, containerRef, showError])

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
    }, [codeStr, containerRef, initMermaid]);

    const handleDownloadSVG = useCallback((event) => {
        // console.log(event.target);
        event.target.href = `data:image/svg+xml;base64,${Base64.encode(containerRef.current.innerHTML)}`;
        event.target.download = `mermaid-${moment().format(
            'YYYYMMDD-HHmmss'
          )}.svg`
    }, [containerRef])

    const buttonsElement = useMemo(() => {
        if(showError){
            return null;
        }else{
            return (
                <div className="buttons">
                    <span className="buttom" onClick={() => setShowCode(prevState => !prevState)}>
                        <Icon type="code" />{showCode ? "隐藏" : "显示"}
                    </span>

                    <span className="buttom">
                        <CopyIcon title="mermaid" text="代码" content={codeStr}/>
                    </span>

                    <a href="#/" download='' onClick={handleDownloadSVG} className="buttom">
                        <Icon type="download" />svg
                    </a>
                </div>
            )
        }
    }, [handleDownloadSVG, showError, codeStr, showCode])

    return (
        <div className="mermaid">
            <div ref={containerRef} className="preview">
            </div>

            {/* 是否有错误 */}
            {
                showError && (
                    <div>
                        <div className="error">
                            Syntax Error
                        </div>
                    </div>
                )
            }

            {/* 按钮组件 */}
            {buttonsElement}

            {/* 点击了显示code、出错的时候显示 */}
            {
                (showCode || showError) && (
                    <div className="code">
                        {codeStr}
                    </div>
                )
            }
            
        </div>
    )
}

export default MermaidElement;
