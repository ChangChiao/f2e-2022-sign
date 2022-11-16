import type { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
    // The styles all button have in common
    baseStyle: {
      textTransform: 'uppercase',
      cursor: 'pointer',
      borderRadius: 'base', // <-- border radius is same for all variants and sizes
    },
    sizes: {
      sm: {
        fontSize: 'sm',
        px: 4, 
        py: 3, 
      },
      md: {
        fontSize: 'md',
        px: 6, 
        py: 4, 
      },
      lg: {
        fontSize: 'lg',
        px: 10, 
        py: 5, 
      },
    },
    // Two variants: outline and solid
    variants: {
      outline: {
        border: '2px solid',
        borderColor: 'gray.200',
        color: 'gray.500',
        _hover: {
          bgColor: 'gray.100',
        },
      },
      solid: {
        bg: 'primary.default',
        color: 'white',
        _hover: {
          bgColor: 'primary.dark',
        },
      },
      disable: {
        bg: 'gray.200',
        color: '#aaa',
        _hover: {
          bgColor: '#ddd',
        },
      }
    },
    // The default size and variant values
    defaultProps: {
      size: 'md',
      variant: 'solid',
    },
  // variants: {
  //   base: ({ theme }) => ({
  //     border: '1px solid',
  //     borderColor: 'primary.200',
  //     color: 'black',
  //     bg: 'transparent',
  //     transition: 'ease',
  //     transitionDuration: '0.3s',
  //   }),
  // },
};

export default Button;