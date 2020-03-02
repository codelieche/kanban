import React, { useState } from 'react';

// import MyEditor from "../Editor";
// import { CodePrismDemo } from "../Editor/Element/Code";
import ResizeDemo from "./demo/resizeable";
import UplaodImageItem from  "../Base/Forms/UplaodImageItem"
import UpladImageTabs from "../Page/UploadImage";

export class TestPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        return (
            <div>
                Test Page
            </div>
        )
    }
}

export function TestPageFunc() {
    // console.log(React)

    const [fileListData, setFileListData] = useState([]);

    return (
        <div>
            This Is Test Page Function
            <br />
            <p>Resize</p>
            <ResizeDemo />
            {/* <MyEditor /> */}
            {/* 测试 */}
            {/* <CodePrismDemo /> */}

            <p>上传图片</p>
            <div style={{padding: 10, margin: 10, height: 150, border: "1px solid #f5f5f5"}}>
                <UplaodImageItem 
                  url=""
                  fileListData={fileListData}
                  setFileListData={setFileListData}
                  tooltip={<div style={{color: "#999", fontSize: 12}}>请选择要上传的图片</div>}
                />
            </div>

            <UpladImageTabs />
            
        </div>
    );
}


export default TestPageFunc;
// export default ResizeDemo;

