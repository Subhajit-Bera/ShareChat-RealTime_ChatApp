import React from 'react'
import { ChatState } from "../Context/ChatProvider";
const Chat = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}
        {user && <Chatbox/>}
      </Box>
    </div>
  )
}

export default Chat
