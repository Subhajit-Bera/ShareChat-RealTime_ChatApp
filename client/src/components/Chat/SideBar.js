import React from 'react'
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react';
import ProfileModal from '../ProfileModal';
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks"; //For drawer
import { Input } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserListItem';
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../GlobalFunctions/ChatFunctionality"

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);


  // ChatProvider:Context Api
  const { user, setSelectedChat, chats, setChats, notification,
    setNotification, } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure(); //for drawer

  const navigate = useNavigate();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/v1/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json", //beacuse we are sending some json data
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/v1/chat`, { userId }, config);

      //If chat alredy exist inside chats, it will append the chat into setChats:for that we use spread operator 
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }


  return (

    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >

        {/* Search Bar & Icon */}
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          {/* Search Button */}
          <Button variant="ghost" onClick={onOpen} >
            {/* onClick={isOpen} : for the Drawer   */}
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4} >
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* Title */}
        <Text fontSize="3xl" fontFamily="Work sans">
          Share-Chat
        </Text>


        <div>
          {/* Notification */}
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="3xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users).name}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Profile & Logout */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Sidebar for search */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button bg="#39A7FF" color="white" onClick={handleSearch} _hover={{ bg: "#209cff" }}
              >Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)} //accessChat function create chat whith the given user._id
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar
