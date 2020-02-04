/**
 * Form组件上传图片的Item:
 * 需要传递的属性：展示图片的url
 * - url: 显示略缩图的url
 * - fileListData: 文件列表
 * - fileListDataState: 操作文件列表状态的函数
 * 
 *  使用示例：
 *      const [fileListData, fileListDataState] = useState([]);
 *      <UploadImageItem 
 *         url={data.image}
 *         fileListData={fileListData}
 *         fileListDataState={fileListDataState}
 *      />
 * 在上级函数中操作fileListData即可
 */

import React, { useState, useEffect} from "react";

import {
    Upload, message
} from "antd";

// 图片上传Item
// 参数：
// 1. url: 图片的url，可为空
// 2. fileListData: 文件列表
// 3. fileListDataState: 操作文件列表的state函数
function UploadImageItem(props){
    // url, fileListData, fileListDataState
    // url状态
    const [isUploaded, isUploadedState] = useState(false);
    const [imageUrl, imageUrlState] = useState(null);

    // 相当于：componentDidMount等函数
    useEffect(() => {
        // console.log(url, imageUrl);
        // console.log(url !== imageUrl, !isUploaded)
        if(props.url !== imageUrl && !isUploaded){
            imageUrlState(props.url);
        }
    }, [props.url, imageUrl, isUploaded]);

    // 上传组件属性
    const uploadProps = {
        name: "file",
        multiple: false,
        onRemove: (file) => {
            // 把feilename字段设置为空
            console.log(file);
            props.fileListDataState(prevState => {
                let fileList = prevState;
                // 把当前的file从fileList中移除
                const index = fileList.indexOf(file);
                if(index >= 0 && imageUrl){
                    imageUrlState(null);
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
            props.fileListDataState([file]);

            let uploadImageUrl = URL.createObjectURL(file);
            isUploadedState(true);
            imageUrlState(uploadImageUrl);
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
            <p className="ant-upload-hint">
                请选择一张图片
                {imageElement}
            </p>
        </Upload.Dragger>
    );

}

export default UploadImageItem;