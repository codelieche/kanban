import React, { useState } from 'react';
import { Button } from "antd";

// import MyEditor from "../Editor";
// import { CodePrismDemo } from "../Editor/Element/Code";
import ResizeDemo from "./demo/resizeable";
import UplaodImageItem from  "../Page/UplaodImageItem"
import { UploadImageTabsModal, UploadImageTabs } from "../Page/UploadImage";


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
    const [modalVisible, setModalVisible] = useState(false)

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
            <div style={{padding: 10, margin: 10, minHeight: 150, border: "1px solid #f5f5f5"}}>
                <UplaodImageItem 
                  url=""
                  fileListData={fileListData}
                  setFileListData={setFileListData}
                  tooltip={<div style={{color: "#999", fontSize: 12}}>请选择要上传的图片</div>}
                />
            </div>

            <UploadImageTabs />

            <hr/>
            {/* 点击按钮上传图片测试 */}
            <Button onClick={() => {setModalVisible(prevState => !prevState)}}>
                上传图片
            </Button>

            <UploadImageTabsModal 
              visible={modalVisible} 
              handleAfterClose={() => setModalVisible(false)}
              afterUploadHandle={(imageUrl) => {console.log("上传了图片：", imageUrl); setModalVisible(false)}}
            />
            
        </div>
    );
}


export default TestPageFunc;
// export default ResizeDemo;

