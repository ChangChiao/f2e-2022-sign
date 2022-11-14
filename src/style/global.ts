import { ChakraTheme } from '@chakra-ui/react';

const global: ChakraTheme['styles'] = {
  global: {
    html: {
      h: 'full',
      scrollBehavior: 'smooth',
    },
    body: {
      fontFamily: 'Noto Sans TC, sans-serif',
      h: 'full',
    },
  },
};

export default global;
