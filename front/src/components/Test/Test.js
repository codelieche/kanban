import React, { useState } from 'react';
import { Button } from "antd";

// import MyEditor from "../Editor";
// import { CodePrismDemo } from "../Editor/Element/Code";
import ResizeDemo from "./demo/resizeable";
import UplaodImageItem from  "../Page/UplaodImageItem"
import { UploadImageTabsModal, UploadImageTabs } from "../Page/UploadImage";
import CopyIcon from "../Page/Copy";
import BaseForm from "../Base/Forms/BaseForm";

const baseFormFieds = [
    {
        type: "input",
        label: "ID",
        required: true,
        name: "id",
        hiddle: true,
        placeholder: "请输入ID",
        help: "请输入ID",
        disabled: true,
        rules: [
            {
                required: true,
                message: "请输入ID"
            }
        ]

    },
    {
        type: "input",
        label: "名字",
        required: true,
        name: "name",
        placeholder: "请输入名字",
        help: "请输入用户名",
        rules: [
            {
                required: true,
                message: "请输入名字"
            }
        ]
    },
    {
        type: "radio",
        label: "状态",
        name: "active",
        help: "请输入状态",
        rules: [
            {
                required: true,
                message: "请选择状态"
            }
        ],
        choices: [
            {
                text: "开启",
                value: true,
            },
            {
                text: "禁用",
                value: false
            },
            {
                text: "不设置",
                value: "none"
            }
        ]
    
    }
]

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

            {/* 测试复制 */}
            <div>
                <span>测试复制功能：</span>
                <CopyIcon title="图片链接" content="This Is For Test" />
                <CopyIcon title="图片链接" content="This Is For Test2" className="copy" />
                <CopyIcon title="图片链接" content="This Is For Test3" className="copy3" text="复制" />
            </div>
            {/* 动态Form */}
            <div>
                <BaseForm 
                  fields={baseFormFieds}
                  data={{id: 10, name: "This is For Test", active: true}}
                //   data={{name: "This is For Test", active: true}}
                  buttonName="提交基础表单"
                  handleSubmit={(values) => {console.log(values)}}
                />
            </div>
            
            
        </div>
    );
}


export default TestPageFunc;
// export default ResizeDemo;

