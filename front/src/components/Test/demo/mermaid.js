/**
 * Mermaid Preview Demo
 */
import React, {useMemo, useEffect, useCallback} from "react";
import mermaid from "mermaid";


export const PreviewDemo = ({code}) => {

    const containerRef = useMemo( () => React.createRef(), [])

    const initMermaid = useCallback(() => {
        
        let codeStr = code;
        if(!code){
            codeStr = `graph TD
            A -->B
            B -->C
            C -->D
            C -->E
            C -->F
            `
        }
        try {
          mermaid.parse(codeStr)
          // Replacing special characters '<' and '>' with encoded '&lt;' and '&gt;'
          let _code = codeStr
          _code = _code.replace(/</g, '&lt;')
          _code = _code.replace(/>/g, '&gt;')
          // Overriding the innerHTML with the updated code string
        //   console.log(_code);

          containerRef.current.innerHTML = _code
          mermaid.init(undefined, containerRef.current);

        } catch (e) {
          // {str, hash}
          console.log(e);
        //   const base64 = Base64.encodeURI(e.str || e.message)
        //   history.push(`${url}/error/${base64}`)
        }
    },[code, containerRef])

    useEffect(() => {
        initMermaid();
    }, [initMermaid])

    return (
        <div ref={containerRef}>
            Hello Code
        </div>
    )
}


export default PreviewDemo;
