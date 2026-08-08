import Logo from './logo.twig';
import './logo.scss';

export default {
  title: 'Components/Atoms/Logo',
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
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the logo',
    },
  },
  component: Logo,
};

export const Default = {
  args: {
    attributes: {},
    href: '',
    size: 'medium',
  },
};

export const Small = {
  args: {
    attributes: {},
    href: '',
    size: 'small',
  },
};

export const Large = {
  args: {
    attributes: {},
    href: '',
    size: 'large',
  },
};

export const WithLink = {
  args: {
    attributes: {},
    href: '/',
    size: 'medium',
    title: 'Home',
  },
};
