
import React from "react";
import { Resizable } from 'react-resizable';

// import '../../../../node_modules/react-resizable/css/styles.css';

function ResizeDemo(props){
    const [width, setWidth] = React.useState(140);

    const onResize = (event, { element, size }) => {
        console.log(size);
        // console.log(element);
        setWidth(size.width);
      };
    return (
        <Resizable className="box"  axis='x' height={0} width={width} onResize={onResize}>

            <div style={{ width: width + 'px', borderRight: "1px solid #eee"}}>

              <span className="text">{"Raw use of <Resizable> element. 200x200, no constraints."}</span>

            </div>
        </Resizable>    
    );
}

export default ResizeDemo;