/**
 * 可伸缩的表格Title
 */
import React from "react";

import { Resizable } from "react-resizable";

export const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;
    
    // console.log(props);
    // console.log(restProps);

    if (!width) {
      return <th {...restProps} />;
    }

    const handleOnClick = e => {
        e.stopPropagation();
    }
    return (
      <Resizable
        width={width}
        height={0}
        // handle={resizeHandle => {
        //     console.log(resizeHandle);
        //     return (
        //     <span
        //         className={`react-resizable-handle react-resizable-handle-${resizeHandle}`}
        //         onClick={e => {
        //         e.stopPropagation();
        //         }}
        //     />
        //     )
        // }}
        handle={<span className="react-resizable-handle" onClick={handleOnClick}></span>}
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    );
  };

  export default ResizeableTitle;
