import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => { //children is the whole app
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [chats, setChats] = useState();
    const [notification, setNotification] = useState([]);
    

    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) navigate("/");
    }, [navigate]);
    return (
        <ChatContext.Provider value={{ user, setUser,chats,setChats,selectedChat,setSelectedChat,notification,
            setNotification, }}>
            {children}
        </ChatContext.Provider>
    );

};


export const ChatState = () => {
    return useContext(ChatContext);
};


export default ChatProvider;