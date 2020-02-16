/**
 * 项目用到的context相关的对象
 */
import React from "react";

// const [username, setUsername] = useState("匿名");

export const UserinfoContext = React.createContext({
    logined: false,
    username: "匿名",
    // setUsername: setUsername
});

export default UserinfoContext;
