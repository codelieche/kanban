/**
 * 用户组编辑页
 */
import React, {useState, useCallback, useContext, useEffect} from "react";
import { message } from "antd";

import fetchApi from "../../Utils/fetchApi";
import UserGroupForm from "./Form";
import { GlobalContext } from "../../Base/Context";
import LoadingPage from "../../Page/Loading";

export const UserGroupEditor = (props) => {
  // 状态
  const [ id, setID ] = useState(null);
  const [ data, setData ] = useState({});
  const [ loaded, setLoaded ] =useState(false);

  // 获取全局设置导航
  const { setNavData } = useContext(GlobalContext);

  useEffect(() => {
    // 设置导航数据
    setNavData([
      {
        title: "首页",
        icon: "home",
        link: "/"
      },
      {
        title: "用户",
        link: "/user"
      },
      {
        title: "分组",
        link: "/user/group/list"
      },
      {
        title: "编辑",
      }
    ])
  }, [setNavData]);
  

  const fetchData = useCallback((groupID) => {
    // 获取group的编辑数据
    const url =
      "/api/v1/account/group/" + groupID + "/editor";
    fetchApi.Get(url)
      .then(responseData => {
        setData(responseData);
        setLoaded(true);
      })
      .catch(err => {
        console.log(err);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if(props.match.params.id && props.match.params.id !== id){
      setID(props.match.params.id);
      // 获取详情数据
      fetchData(props.match.params.id);
    }
  }, [fetchData, id, props.match.params.id])

  const handleEditorSubmit = useCallback(values => {
    // 提交编辑表单处理函数
    // console.log(values);
    // 通过fetch PUT 编辑Group
    const url = "/api/v1/account/group/" + id;
    fetchApi.Put(url, {}, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: values
    })
      .then(responseData => {
        if (responseData.id > 0) {
          props.history.push("/user/group/" + id);
        } else {
          message.error(JSON.stringify(responseData), 8);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [id, props.history]);

  if(!loaded){
    return (
      <LoadingPage />
    );
  }

  return (
    <div className="content">
      <div className="main">
        <div className="title">
          <h4>编辑用户组</h4>
        </div>
        <div className="wrap">
          <UserGroupForm
            handleSubmit={handleEditorSubmit}
            data={data}
            type="editor"
          />
        </div>
      </div>
    </div>
  );
}

export default UserGroupEditor;
