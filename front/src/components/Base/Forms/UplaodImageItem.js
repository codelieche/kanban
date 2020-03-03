/**
 * Form组件上传图片的Item:
 * 需要传递的属性：展示图片的url
 * - url: 显示略缩图的url
 * - fileListData: 文件列表
 * - setFileListData: 操作文件列表状态的函数
 * - tooltip: 提示：默认是<div>请选择一张要上传的图片</div>
 *  使用示例：
 *      const [fileListData, setFileListData] = useState([]);
 *      <UploadImageItem 
 *         url={data.image}
 *         fileListData={fileListData}
 *         setFileListData={setFileListData}
 *      />
 * 在上级函数中操作fileListData即可
 */

import React, { useState, useEffect, useCallback} from "react";

import {
    Upload, message
} from "antd";

// 图片上传Item
// 需要传递的属性：props：
// 1. url: 图片的url，可为空
// 2. fileListData: 文件列表
// 3. setFileListData: 操作文件列表的state函数
function UploadImageItem(props){
    // url, fileListData, setFileListData
    // url状态
    const [isUploaded, isUploadedState] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    // 处理复制图片事件
    const handlePasteEvent = useCallback(event => {
        // console.log(event);
        // 阻止冒泡
        event.stopPropagation();
        if(event.clipboardData || event.originalEvent){
            // chrome有些老版本中是：event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);

            if(clipboardData.items){
                let items = clipboardData.items;
                for(var i = 0; i < items.length; i++){
                    // console.log(items[i]);
                    if(items[i].type.indexOf("image") >= 0){
                        // 是复制的图片
                        let imageFile = items[i].getAsFile();
                        imageFile.uid = `parse-upload-${Math.round(Math.random() * 1000000000)}`;
                        let imageUrl = URL.createObjectURL(imageFile);
                        // console.log(imageFile, imageUrl);
                        // console.log(typeof imageFile);
                        props.setFileListData([imageFile]);
                        setImageUrl(imageUrl);
                    }
                }
            }
        }
    }, [props])

    // 相当于：componentDidMount等函数
    useEffect(() => {
        // console.log(url, imageUrl);
        // console.log(url !== imageUrl, !isUploaded)
        if(props.url !== imageUrl && !isUploaded && !imageUrl){
            setImageUrl(props.url);
        }

        document.addEventListener("paste", handlePasteEvent);

        return () => {
            document.removeEventListener("paste", handlePasteEvent);
        }
        
    }, [props.url, imageUrl, isUploaded, handlePasteEvent, props.fileListData.length]);

    // 上传组件属性
    const uploadProps = {
        name: "file",
        multiple: false,
        onRemove: (file) => {
            // 把feilename字段设置为空
            console.log(file);
            props.setFileListData(prevState => {
                let fileList = prevState;
                // 把当前的file从fileList中移除
                const index = fileList.indexOf(file);
                if(index >= 0 && imageUrl && !isUploaded){
                    // 如果是选择了图片文件，点删除，重新设置图片链接为空会报错
                    setImageUrl(null);
                }
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);

                return newFileList;
            });
        },

        beforeUpload: (file) => {
            // console.log(file);
            // 选择了文件后，把文件名设置到form中
            if(file.type.indexOf("image") < 0){
                message.warn("请选择图片文件");
                // console.log(file, file.type);
                return false;
            }
            
            // 修改文件列表的数据
            props.setFileListData([file]);

            let uploadImageUrl = URL.createObjectURL(file);
            isUploadedState(true);
            setImageUrl(uploadImageUrl);
            return false;
        },
        fileList: props.fileListData,
    }
    // 显示略缩图
    let imageElement;
    if(imageUrl){
        imageElement = (
          <img style={{maxWidth: "100%", height: "auto"}}  
            src={imageUrl} alt="图片" />
      );
    }

    return(
        <Upload.Dragger
          {...uploadProps}
        >
            <div className="ant-upload-hint">
                {/* 显示默认的图片，或者上传的图片 */}
                {imageElement}
                {/* 文字提示 */}
                {props.tooltip ? props.tooltip : <div>请选择一张要上传的图片</div>}
                
            </div>
        </Upload.Dragger>
    );

}

export default UploadImageItem;