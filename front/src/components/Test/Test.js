import React from 'react';

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
        </div>
    )
}


export default TestPageFunc;

export {
    TestPage,
    TestPageFunc
}
