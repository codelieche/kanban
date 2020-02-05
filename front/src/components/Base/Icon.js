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
import React from 'react';

// 自定义的Icon组件
class Icon extends React.Component {
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
export default Icon;