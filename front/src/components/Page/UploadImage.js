/**
 * 上传图片的块
 * 有三种方式上传图片
 * 1. 选择本地的图片
 * 2. 选择链接
 * 3. 选择系统中的图片
 * 4. 网络搜索图片
 */
import React, { useState, useEffect, useCallback, useMemo} from "react";

import {
    Tabs,
    Input,
    Button,
    message
} from "antd";

import fetchApi from "../Utils/fetchApi";
import UplaodImageItem from "../Base/Forms/UplaodImageItem";


/**
 * 上传图片的组件
 * 1. uploadImage: 选择本地图片上传
 * 2. useLink: 选择外部链接上传
 * 3. useSystem: 使用系统中的图片
 * 4. searchImage: 搜索图片上传
 * 
 * 需要传递的属性
 * 1. afterUploadHandle = (url) = {}: 得到图片链接后需要的处理函数
 * @param {*} props 
 */
export const UploadImageTabs = (props) => {
    // 设置状态
    const [ activeTabKey, setActiveTabKey ] = useState("uploadImage");
    const [fileListData, setFileListData] = useState([]);
    // 上传或者输入的图片链接
    const [imageUrl, setImageUrl] = useState(null);

    // Tab变更
    const onTabChange = useCallback((key) => {
        setActiveTabKey(key);
    }, [])

    useEffect(() => {
        
    }, [])

    // 输入图片链接
    const handleInputImageUrl = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();
        setImageUrl(e.target.value);
    }, []);

    // 处理上传图片操作
    const handleUploadImage = useCallback(() => {
        // 检查是否有图片数据
        if( fileListData.length < 1 ){
            return;
        }

        // 通过表单 上传图片
        let formData = new FormData();
        for(var i=0; i < fileListData.length; i++){
            formData.append("file", fileListData[i]);
        }
        
        // 发起Post请求
        let url = "/api/v1/docs/image/upload";
        fetchApi.Post(url, formData, {})
          .then(responseData => {
              console.log(responseData);
          })
            .catch(err => {
                console.log(err);
            })
    }, [fileListData])

    const checkImageUrlPattern = useMemo(() => {
        // 检查图片是否以这些结尾
        return /\.(png)|(jpg)|(gif)|(jpeg)$/;
    }, []);

    const handleSubmit = useCallback((e) => {
        console.log(e);

        if( activeTabKey === "uploadImage" ){
            // 情况1：上传图片文件
            if( fileListData.length > 0 ){
                // 发起上传图片请求
                handleUploadImage();
                return;
            }else{
                message.warn("请选择需要上传的图片");
            }
        }else if( activeTabKey === "useLink" ){
            // 情况2：选择的输入图片
            if(!!imageUrl){
                if(checkImageUrlPattern.test(imageUrl)){

                }else{
                    message.warn("图片的地址需要以jpg/jpeg/png/gif结尾");
                }

            }else{
                message.warn("请输入图片的网址")
            }
        }

    }, [activeTabKey, checkImageUrlPattern, fileListData.length, handleUploadImage, imageUrl])

    

    // 提交按钮是否未禁用
    let submitDisable = true;
    if(activeTabKey === "uploadImage"){
        if(fileListData.length > 0){
            submitDisable = false;
        }
    }else if( activeTabKey === "useLink" ){
        if(!!imageUrl && checkImageUrlPattern.test(imageUrl)){
            submitDisable = false;
        }
    }

    return (
        <div className="upload-image-tabs">
            <Tabs defaultActiveKey={activeTabKey} onChange={onTabChange}>
                <Tabs.TabPane tab="上传图片" key="uploadImage">
                    <div className="upload">
                        <UplaodImageItem
                            url=""
                            fileListData={fileListData}
                            setFileListData={setFileListData}
                        />
                    </div>
                    
                </Tabs.TabPane>

                <Tabs.TabPane tab="使用链接" key="useLink">
                    <div className="input-url">
                        <Input placeholder="输入图片地址" 
                          allowClear={true}
                          onChange={handleInputImageUrl} />
                    </div>
                        { 
                            activeTabKey === "useLink" && imageUrl && checkImageUrlPattern.test(imageUrl) &&  (
                                <div className="show-image"> 
                                    <img src={imageUrl} alt="图片"></img>
                                </div>
                            )
                        }
                </Tabs.TabPane>
            </Tabs>
            {/* <div>
                <span>{imageUrl}</span>
            </div> */}
            <div className="button">
                <Button type="primary" 
                  onClick={handleSubmit} 
                  disabled={submitDisable}
                >
                    提交
                </Button>
            </div>
        </div>
    );
}

export default UploadImageTabs;
