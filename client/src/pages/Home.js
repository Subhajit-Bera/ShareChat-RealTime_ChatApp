import React,{useEffect} from 'react'
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import Login from "../components/User/Login";
import Signup from "../components/User/Signup";


const Home = () => {
  const navigate=useNavigate();
  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo){
      navigate("/chats");
    }
  },[navigate]);
  return (
    <Container maxW="xl" centerContent className="home">
      <Box
        d="flex"
        align="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="3xl">
          Share Chat
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
