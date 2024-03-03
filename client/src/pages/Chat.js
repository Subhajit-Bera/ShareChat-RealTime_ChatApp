import { Box } from "@chakra-ui/layout";
import React from 'react'
import { ChatState } from "../Context/ChatProvider";
import SideBar from '../components/Chat/SideBar';
import MyChats from '../components/Chat/MyChats';
import Chatbox from '../components/Chat/Chatbox';
const Chat = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}
        {user && <Chatbox/>}
      </Box>
    </div>
  )
}

export default Chat
