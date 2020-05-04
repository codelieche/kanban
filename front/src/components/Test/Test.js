import React, { useState, useEffect } from 'react';
import { Button, message } from "antd";

// import MyEditor from "../Editor";
// import { CodePrismDemo } from "../Editor/Element/Code";
import Icon from "../Base/Icon";
import ResizeDemo from "./demo/resizeable";
import UplaodImageItem from  "../Page/UplaodImageItem"
import { UploadImageTabsModal, UploadImageTabs } from "../Page/UploadImage";
import CopyIcon from "../Page/Copy";
import BaseForm from "../Base/Forms/BaseForm";
import BaseFormModal from "../Page/BaseForm";
import onKeyDown from "../Utils/onKeyDown";

import { GroupsTest } from "../Page/Groups";

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
        ],
        props: {
            addonAfter: <Icon type="eye" />
        }
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
    },
    {
        type: "checkbox",
        label: " ",
        name: "check",
        rules: [
            {required: false, message: "请选择"}
        ],
        choices: [
            {text: "Python", value: "python"},
            {text: "Golang", value: "go"}
        ],
        props: {
            onChange: (values) => console.log(values)
        },
        layout: {
            wrapperCol: { offset: 8, span: 16 },
        }
    },
    {
        type: "switch",
        label: "开关",
        name: "toogle",
        rules: [
            {required: true, message: "请选择值"}
        ],
        props: {
            checkedChildren: "开",
            unCheckedChildren: "关"
        },
        
    },
    {
        type: "datepick",
        label: "开始日期",
        name: "date_start",
        rules: [
            {required: true, message: "请选择开始日期"}
        ],
        props: {
            showTime: true
        },
        
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
    const [ showBaseFormModal, setShowBaseFormModal] = useState(false);

    const [fileListData, setFileListData] = useState([]);

    useEffect(() => {
        document.onkeydown = onKeyDown;
    })

    return (
        <div>
            This Is Test Page Function

             {/* 分组导航测试 */}
             <div>
                <div>分组导航测试</div>
                <GroupsTest />
            </div>
            
            <div>
                <p>Resize</p>
                <ResizeDemo />
            </div>
            <br />
            
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

                {/* 点击弹出基础表单 */}
                <Button type="primary" onClick={() => setShowBaseFormModal(true)}>显示表单</Button>
                    <BaseFormModal name="testBaseFormModal" 
                    title="测试基础表单Modal"
                    visible={showBaseFormModal}
                    data={{id: 10}}
                    handleAfterClose={e => {setShowBaseFormModal(false)}}
                    handleSubmit={values => {setShowBaseFormModal(false); console.log(values); message.success(JSON.stringify(values))}}
                    fields={baseFormFieds}/>
            </div>

           
            
            
        </div>
    );
}


export default TestPageFunc;
// export default ResizeDemo;

