import Menu from './menu.twig';
import './menu.scss';

export default {
  title: 'Components/Organisms/Menu',
  parameters: {
    docs: {
      description: {
        component: 'Navigation menu component with support for active states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    name: {
      control: { type: 'text' },
      description: 'Name of the menu, used for accessibility and identification.',
    },
    links: {
      control: { type: 'object' },
      description: 'Array of menu items with title, href, and optional active state.',
    },
  },
  component: Menu,
};

export const Default = {
  args: {
    attributes: {},
    name: 'Main Menu',
    links: [
      { title: 'Home', href: '/', active: true },
      { title: 'About', href: '/about', active: false },
      { title: 'Services', href: '/services', active: false },
      { title: 'Contact', href: '/contact', active: false },
    ],
  },
};

export const WithActiveItem = {
  args: {
    name: 'Main Menu',
    attributes: {},
    links: [
      { title: 'Home', href: '/', active: false },
      { title: 'About', href: '/about', active: false },
      { title: 'Services', href: '/services', active: true },
      { title: 'Contact', href: '/contact', active: false },
    ],
  },
};

export const SingleItem = {
  args: {
    name: 'Main Menu',
    attributes: {},
    links: [
      { title: 'Home', href: '/', active: true },
    ],
  },
};
