import React from 'react';

// import MyEditor from "../Editor";
// import { CodePrismDemo } from "../Editor/Element/Code";
import ResizeDemo from "./demo/resizeable";

export class TestPage extends React.Component{
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

export function TestPageFunc() {
    // console.log(React)
    return (
        <div>
            This Is Test Page Function
            <br />
            {/* <MyEditor /> */}
            {/* 测试 */}
            {/* <CodePrismDemo /> */}
        </div>
    );
}


// export default TestPageFunc;
export default ResizeDemo;

