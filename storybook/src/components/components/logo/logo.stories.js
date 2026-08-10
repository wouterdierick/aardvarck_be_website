import Logo from './logo.twig';
import './logo.scss';

export default {
  title: 'Components/Logo',
  parameters: {
    docs: {
      description: {
        component: 'Logo component with optional link and size variants.',
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
      options: ['primary', 'secondary', 'black', 'white'],
      description: 'Color of the logo',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the logo',
    },
  },
  component: Logo,
};

export const Primary = {
  args: {
    attributes: {},
    href: '',
    color: 'primary',
    size: 'medium',
  },
};

export const Secondary = {
  args: {
    attributes: {},
    href: '',
    color: 'secondary',
    size: 'medium',
  },
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
    size: 'medium',
  },
};

export const WithLink = {
  args: {
    attributes: {},
    title: 'Home',
    href: '/',
    color: 'primary',
    size: 'medium',
  },
};
