import UserMenu from './user-menu.twig';
import './user-menu.scss';
import './user-menu.js';

export default {
  title: 'Components/User Menu',
  parameters: {
    docs: {
      description: {
        component: 'User menu component with dropdown and link-list variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    variant: {
      control: { type: 'select' },
      options: ['dropdown', 'link-list'],
      description: 'User menu variant.',
    },
    title: {
      control: { type: 'text' },
      description: 'Accessible label for the menu.',
    },
    links: {
      control: false,
      description: 'Menu links.',
    },
  },
  component: UserMenu,
};

export const Dropdown = {
  args: {
    attributes: {},
    variant: 'dropdown',
    title: 'My account',
    links: [
      { title: 'My orders', href: '/en/user/1/orders' },
      { title: 'My account', href: '/user' },
      { title: 'Logout', href: '/user/logout' },
    ],
  },
};

export const LinkList = {
  args: {
    attributes: {},
    variant: 'link-list',
    title: 'My account',
    links: [
      { title: 'My orders', href: '/en/user/1/orders' },
      { title: 'My account', href: '/user' },
      { title: 'Logout', href: '/user/logout' },
    ],
  },
};
