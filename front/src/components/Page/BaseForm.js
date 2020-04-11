/**
 * 基础表单:
 * 1. BaseFormModal
 */
import React, { useCallback } from "react";
import PropTypes from "prop-types";

import BaseForm from "../Base/Forms/BaseForm";

import {
    Modal
} from "antd";

export const BaseFormModel = (props) => {
    // 状态
    const {visible, title, handleAfterClose, ...restProps} = props;

    // 确认或者关闭的时候
    const handleOnCloseOrOk = useCallback(e => {
        // console.log(e);
        e.stopPropagation();
        if(handleAfterClose){
            handleAfterClose();
        }
    }, [handleAfterClose])
    
    return (
        <Modal 
         title={title}
         visible={props.visible}
         onOk={handleOnCloseOrOk}
         onCancel={handleOnCloseOrOk}
         destroyOnClose={true}
         footer={null}
         >
             <BaseForm {...restProps} />
         </Modal>
    );
}

BaseFormModel.propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    handleAfterClose: PropTypes.func.isRequired,
    fields: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired,   // 提交表单的操作
}

export {
    BaseForm,
}

export default BaseFormModel;
