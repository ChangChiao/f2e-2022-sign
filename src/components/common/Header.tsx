import React from 'react'
import logo from "../../assets/images/Logo.png";
import { Box, Text, Flex, Image } from "@chakra-ui/react"
function Header() {
  return (
    <Flex as='header' alignItems={'center'} justifyContent={'space-between'} borderBottom={'1px'} borderColor={'gray.500'} height={'50px'} px={'80px'}>
      <Image src={logo} />
      <Text textStyle={'h5'}>快速省時的電子簽署工具</Text>
      <Box />
    </Flex>
  )
}

export default Header