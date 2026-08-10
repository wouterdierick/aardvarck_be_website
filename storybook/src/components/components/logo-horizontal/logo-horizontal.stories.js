import LogoHorizontal from './logo-horizontal.twig';
import './logo-horizontal.scss';

export default {
  title: 'Components/Logo Horizontal',
  parameters: {
    docs: {
      description: {
        component: 'Horizontal logo component with optional link and size variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    title: {
      control: { type: 'text' },
      description: 'Optional title attribute for the logo.',
    },
    href: {
      control: { type: 'text' },
      description: 'Optional link URL. If provided, logo renders as a link.',
    },
    color: {
      control: { type: 'select' },
      options: ['black', 'white'],
      description: 'Color of the logo',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the logo',
    },
  },
  component: LogoHorizontal,
};

export const Black = {
  args: {
    attributes: {},
    href: '',
    color: 'black',
    size: 'medium',
  },
};

export const White = {
  args: {
    attributes: {},
    href: '',
    color: 'white',
    size: 'small',
  },
};

export const WithLink = {
  args: {
    attributes: {},
    href: '/',
    color: 'black',
    size: 'medium',
    title: 'Home',
  },
};
