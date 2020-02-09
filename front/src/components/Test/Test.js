import React from 'react';

import MyEditor from "../Editor";

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
        </div>
    )
}


export default TestPageFunc;

export {
    TestPage,
    TestPageFunc
}
