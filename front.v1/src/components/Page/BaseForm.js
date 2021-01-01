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

export const BaseFormModal = (props) => {
    // 状态
    const {visible, title, width, handleAfterClose, data, ...restProps} = props;

    // 确认或者关闭的时候
    const handleOnCloseOrOk = useCallback(e => {
        // console.log(e);
        e.stopPropagation();
        if(handleAfterClose){
            handleAfterClose();
        }
    }, [handleAfterClose])

    // console.log(data);

    return (
        <Modal 
         title={title}
         width={width}
         visible={props.visible}
         onOk={handleOnCloseOrOk}
         onCancel={handleOnCloseOrOk}
         destroyOnClose={true}
         footer={null}
         >
             <BaseForm data={data} {...restProps} />
         </Modal>
    );
}

BaseFormModal.propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    handleAfterClose: PropTypes.func.isRequired,
    fields: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired,   // 提交表单的操作
}

export {
    BaseForm,
}

export default BaseFormModal;
