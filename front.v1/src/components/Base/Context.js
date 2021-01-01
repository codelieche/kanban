/**
 * 项目用到的context相关的对象
 */
import React from "react";

// const [username, setUsername] = useState("匿名");

export const UserinfoContext = React.createContext({});

export const GlobalContext = React.createContext({});

export const RightContext = React.createRef({});

export default GlobalContext;
