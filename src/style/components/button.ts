import type { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  variants: {
    base: ({ theme }) => ({
      border: '1px solid',
      borderColor: 'primary.200',
      boxShadow: `0 0 6px -1px ${theme.colors.secondary[200]},0 0 4px -1px ${theme.colors.secondary[100]}`,
      color: 'black',
      bg: 'transparent',
      transition: 'ease',
      transitionDuration: '0.3s',
    }),
  },
};

export default Button;