import React, { createContext, useContext, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => { //children is the whole app
    const [user, setUser] = useState();
    const navigate=useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
    
        if (!userInfo) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [navigate]);
    return(
        <ChatContext.Provider value={{user,setUser}}>
            {children}
        </ChatContext.Provider>
    );
}

export const ChatState = () => {
    return useContext(ChatContext);
};


export default ChatProvider;