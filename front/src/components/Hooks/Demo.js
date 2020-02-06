/**
 * Hook测试
 * 需要传递的属性：
 * - value: 数据
 */
import React, { useState, useEffect} from "react";
import {Button} from "antd";

function TestDemo(props){
    // 设置状态：
    // const [data, dataState] = useState({});
    // const [showData, showDataState] = useState(false);


    // useEffect(() => {
    //     // console.log(props.value);
    //     if(props.value !== data){
    //         dataState(data);
    //     }
    // }, [props.value, data]);


    // return (
    //     <span>
    //         <Button onClick={() => showDataState(prevState => {return !prevState})}>
    //             {showData ? "隐藏数据" : "显示数据"}
    //         </Button>
    //         {
    //             showData && <p>
    //                 {JSON.stringify(props.value)}
    //             </p>
    //         }
            
    //     </span>
    // );

    const [state, setState] = useState({showData: true, data: {}});

    useEffect(() => {
        if(props.value !== state["data"]){
            setState(prevState => {
                console.log(prevState);
                prevState["data"] = props.value;
                return prevState;
            });
        }
    }, [props.value, state, state.showData]);

    return (
        <span>
            <Button onClick={() => setState(prevState => {console.log(prevState); prevState.showData = !prevState.showData ;return prevState})}>
                {state.showData ? "隐藏数据" : "显示数据"}
            </Button>
            {
                state.showData && <p>
                    {JSON.stringify(state.data)}
                </p>
            }
        </span>
    );

}

export default TestDemo;