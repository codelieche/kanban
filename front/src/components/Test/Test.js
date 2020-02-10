import React from 'react';

import MyEditor from "../Editor";
import { CodePrismDemo } from "../Editor/Element/Code";


class TestPage extends React.Component{
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

function TestPageFunc() {
    // console.log(React)
    return (
        <div>
            This Is Test Page Function
            <br />
            <MyEditor />
            <br />
            {/* 测试 */}
            <CodePrismDemo />
        </div>
    )
}


export default TestPageFunc;

export {
    TestPage,
    TestPageFunc
}
