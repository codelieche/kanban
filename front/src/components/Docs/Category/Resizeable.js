/**
 * 可伸缩的表格Title
 */
import React, { useCallback } from "react";

import { Resizable } from "react-resizable";

export const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;
    // console.log(props);
    // console.log(restProps);

    const handleOnClick = useCallback(e => {
        e.stopPropagation();
    }, [])

    if (!width) {
      return <th {...restProps} />;
    }

    return (
      <Resizable
        width={width}
        height={0}
        // handle={resizeHandle => {
        //     // console.log(resizeHandle);
        //     return (
        //         <span
        //             className={`react-resizable-handle react-resizable-handle-${resizeHandle}`}
        //             onClick={e => {
        //             e.stopPropagation();
        //             }}
        //         />
        //     )
        // }}
        handle={<span className="react-resizable-handle react-resizable-handle-se" onClick={handleOnClick}></span>}
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    );
  };

  export default ResizeableTitle;
