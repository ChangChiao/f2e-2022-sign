import React from 'react'
import logo from "../../assets/images/Logo.png";
import { Box, Text, Flex, Image, Button } from "@chakra-ui/react"
function Header() {
  return (
    <Flex as='header' alignItems={'center'} justifyContent={'space-between'} borderBottom={'1px'} borderColor={'gray.300'}   height={'80px'} px={'80px'}>
      <Image src={logo} />
      <Text textStyle={'h5'}>快速省時的電子簽署工具</Text>
      <Button>設定</Button>
    </Flex>
  )
}

export default Header