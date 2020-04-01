/**
 * Icon组件
 * 需要传递的属性(props):
 * 1. type: 图标的名字
 * 2. spin：是否旋转，默认是false
 * 3. danger: 是否设置为红色
 * 4. noMarginRight: 是否右边边距是否为0
 * 
 * 由于antd4.0开始已经不再内置Icon组件，需要使用独立的包“@ant-design/icons”
 *
 * 故改用fontawesome
 * 参考文档：https://github.com/FortAwesome/Font-Awesome
 */
import React, { useMemo } from 'react';
import PropTypes from "prop-types";


export const Icon2 = ({type, spin, danger, className, children}) => {
    // 状态

    const iconClassName = useMemo(() => {
        let name = `fa fa-${type}`;

        if(spin){
            name += " fa-spin"
        }

        if(danger){
            name += " danger";
        }

        return name;
    }, [danger, spin, type]);
    return (
        <span className={className} style={{display: "inline-block", padding: "0 3px"}}>
            <i className={iconClassName}>
                {children}
            </i>
        </span>
    )
}

// 类型检查
Icon2.propTypes = {
    type: PropTypes.string.isRequired,
    spin: PropTypes.bool,
    danger: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.elementType
}


// 自定义的Icon组件
export class Icon extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            type: this.props.type,
            spin: this.props.spin,
            danger: this.props.danger,
            noMarginRight: this.props.noMarginRight,
        }
    }

    // 组件渲染之后调用，只调用一次
    componentDidMount(){

    }

    // 当rerender的时候触发
    static getDerivedStateFromProps(nextProps, prevState){
    //    console.log(nextProps, prevState);   
       if(nextProps.type !== prevState.type || 
        nextProps.spin !== prevState.spin || nextProps.danger !== prevState.danger || nextProps.noMarginRight !== prevState.noMarginRight){
           return {
               type: nextProps.type,
               spin: nextProps.spin,
               danger: nextProps.danger,
               noMarginRight: nextProps.noMarginRight,
           }
       }else{
           return null;
       }
    }

    render() {
        // console.log(this.state);
        var iconClassName = `fa fa-${this.state.type}`;
        if(this.state.spin){
            iconClassName += " fa-spin"
        }
        if(this.state.danger){
            iconClassName += " danger";
        }

        return (
            <span style={{marginRight: this.state.noMarginRight ? 0 : 5, display: "inline-block"}}>
                <i className={iconClassName}>
                    {this.props.children}
                </i>
            </span>
        );
    }
}
export default Icon2;