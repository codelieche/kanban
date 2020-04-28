/**
 * 上传图片的块
 * 有三种方式上传图片
 * 1. 选择本地的图片: uploadImage
 * 2. 选择链接: useLink
 * 3. 选择系统中的图片
 * 4. 网络搜索图片
 */
import React, { useState, useEffect, useCallback, useMemo} from "react";
import PropTypes from "prop-types";

import {
    Tabs,
    Input,
    Button,
    message,
    Modal
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";
import UploadImageItem from "./UplaodImageItem"


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
        // 当组件初始化的时候传递了activeTabKey就使用它
        // 后续props.activeTabkey更新了，也修改它
        if(props.activeTabKey && props.activeTabKey 
            // 后续如果添加新的tab了，这里记得添加一下
            && ["uploadImage", "useLink"].indexOf(props.activeTabKey) >= 0){
            setActiveTabKey(props.activeTabKey);
        }
    }, [props.activeTabKey])

    // 输入图片链接
    const handleInputImageUrl = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();
        setImageUrl(e.target.value);
    }, []);

    const checkImageUrlPattern = useMemo(() => {
        // 检查图片是否以这些结尾
        return /\.(png)|(jpg)|(gif)|(jpeg)$/;
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
            // console.log(fileListData[i]);
            formData.append("file", fileListData[i]);

            // 添加filename参数
            if(!formData.get("filename")){
                formData.append("filename", fileListData[i].name);
            }
        }
        
        // 发起Post请求
        let url = "/api/v1/docs/image/upload";
        fetchApi.Post(url, formData, {})
          .then(responseData => {
            //   console.log(responseData);
              // 执行得到图片链接后的：后续的操作
              if(responseData.qiniu){
                  if(props.afterUploadHandle){
                    props.afterUploadHandle(responseData.qiniu);
                  }else{
                    console.log("未传递：afterUploadHandle");
                  }
              }else if(responseData.file){
                if(props.afterUploadHandle){
                  props.afterUploadHandle(responseData.file);
                }else{
                  console.log("未传递：afterUploadHandle");
                }
            }else{
                message.warn("上传图片的返回结果file和qiniu字段为空");
            }
          })
            .catch(err => {
                console.log(err);
            })
    }, [fileListData, props])

    

    const handleSubmit = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();

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
                    // 执行得到图片链接后的：后续的操作
                    if(props.afterUploadHandle){
                        props.afterUploadHandle(imageUrl);
                    }else{
                        console.log("未传递：afterUploadHandle");
                    }
                }else{
                    message.warn("图片的地址需要以jpg/jpeg/png/gif结尾");
                }

            }else{
                message.warn("请输入图片的网址")
            }
        }

    }, [activeTabKey, checkImageUrlPattern, fileListData.length, handleUploadImage, imageUrl, props])

    

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
    // 检查下是否传递了imageUrls
    const imageUrlChoicesElements = useMemo(() => {
        if(props.imageUrls && Array.isArray(props.imageUrls)){
            return props.imageUrls.map((item, index) => {
                return (
                    <div className={imageUrl === item ? "image-item active" : "image-item" }
                       key={index} onClick={(e) => {e.stopPropagation(); setImageUrl(item)}}>
                        <img src={item} alt="图片" />
                        <div className="status">
                            <Icon type="check" />
                        </div>
                    </div>
                );
            })
        }else{
            return null;
        }
    }, [imageUrl, props.imageUrls]);

    return (
        <div className="upload-image-tabs">
            <Tabs 
            //   defaultActiveKey={activeTabKey} 
              activeKey={activeTabKey} onChange={onTabChange}>
                <Tabs.TabPane tab="上传图片" key="uploadImage">
                    <div className="upload">
                        <UploadImageItem
                            url=""
                            fileListData={fileListData}
                            setFileListData={setFileListData}
                        />
                    </div>
                    
                </Tabs.TabPane>
                {
                    props.disableLink || (
                    <Tabs.TabPane tab="使用链接" key="useLink">
                        <div className="input-url">
                            <Input placeholder="输入图片地址" 
                            allowClear={true}
                            value={imageUrl}
                            onChange={handleInputImageUrl} />
                        </div>
                        {/* 图片的选项 */}
                        <div className="image-choices">
                            {imageUrlChoicesElements}
                        </div>
                            { 
                                activeTabKey === "useLink" && imageUrl && checkImageUrlPattern.test(imageUrl) &&  (
                                    <div className="show-image"> 
                                        <img src={imageUrl} alt="图片"></img>
                                    </div>
                                )
                            }
                    </Tabs.TabPane>
                    )
                }
                
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

export const UploadImageTabsModal = (props) => {
    const {visible, ...restProps} = props;

    const handleOnCloseOrOk = useCallback((e) => {
        // console.log(e);
        if(props.handleAfterClose){
            props.handleAfterClose()
        }
    }, [props])
    return (
        <Modal 
          wrapClassName="upload-image-modal"
          visible={props.visible} 
          onOk={handleOnCloseOrOk}
          onCancel={handleOnCloseOrOk}
          // 关闭的时候销毁里面的内容，就不会看到上次上传的图片了
          destroyOnClose={true}
          footer={null}  // 不显示底部按钮
        >
            <UploadImageTabs {...restProps} />
        </Modal>
    )
}

// 属性控制
UploadImageTabsModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    activeTabKey: PropTypes.string,                 // 激活的TabKey
    handleAfterClose: PropTypes.func.isRequired,
    afterUploadHandle: PropTypes.func.isRequired,  // 上传图片后的处理函数
    disableLink: PropTypes.bool,                   // 隐藏通过连接上传
    imageUrls: PropTypes.arrayOf(PropTypes.string) // 传递的图片链接数组
}

export default UploadImageTabs;
