import Menu from './menu.twig';
import './menu.scss';

export default {
  title: 'Components/Menu',
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
    orientation: {
      control: { type: 'select' },
      description: 'Orientation of the menu, either horizontal or vertical.',
      options: [
        'horizontal',
        'vertical'
      ],
    },
    system_name: {
      control: { type: 'text' },
      description: 'System name of the menu, used as a unique identifier for the menu.',
    },
    name: {
      control: { type: 'text' },
      description: 'Name of the menu, used for accessibility and identification.',
    },
    show_separator: {
      control: { type: 'boolean' },
      description: 'Adds a 1px separator between menu items.',
    },
    links: {
      control: { type: 'object' },
      description: 'Array of menu items with title, href, optional active state, optional icon_id, and optional hide_label for accessible icon-only links.',
    },
  },
  component: Menu,
};

export const Default = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: false,
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
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: false,
    links: [
      { title: 'Home', href: '/', active: false },
      { title: 'About', href: '/about', active: false },
      { title: 'Services', href: '/services', active: true },
      { title: 'Contact', href: '/contact', active: false },
    ],
  },
};

export const WithIcons = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: false,
    links: [
      { title: 'Home', href: '/', active: false, icon_id: 'home' },
      { title: 'About', href: '/about', active: false, icon_id: 'info' },
      { title: 'Contact', href: '/contact', active: false, icon_id: 'mail' },
    ],
  },
};

export const OnlyIcons = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: false,
    links: [
      { title: 'Home', href: '/', active: false, icon_id: 'home', hide_label: true },
      { title: 'About', href: '/about', active: false, icon_id: 'info', hide_label: true },
      { title: 'Contact', href: '/contact', active: false, icon_id: 'mail', hide_label: true },
    ],
  },
};

export const WithSeparators = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: true,
    links: [
      { title: 'Home', href: '/', active: false },
      { title: 'Projects', href: '/projects', active: false },
      { title: 'About', href: '/about', active: false },
      { title: 'Contact', href: '/contact', active: false },
    ],
  },
};

export const SingleItem = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: false,
    links: [
      { title: 'Home', href: '/', active: true },
    ],
  },
};

export const Vertical = {
  args: {
    attributes: {},
    system_name: 'main-menu',
    name: 'Main Menu',
    show_separator: true,
    orientation: 'vertical',
    links: [
      { title: 'Home', href: '/', active: false },
      { title: 'Projects', href: '/projects', active: false },
      { title: 'About', href: '/about', active: false },
      { title: 'Contact', href: '/contact', active: false },
    ],
  },
};
