import Link from './language-switcher.twig';
import './language-switcher.scss';
import './language-switcher.js';

export default {
  title: 'Components/Language Switcher',
  parameters: {
    docs: {
      description: {
        component: 'The language switcher allows users to switch between different languages.',
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
      options: ['link-list', 'dropdown'],
      description: 'Variant of the language switcher.',
    },
    title: {
      control: { type: 'text' },
      description: 'Language label',
    },
    links: {
      control: { type: 'array' },
      description: 'Array of language links with title and URL.',
    }
  },
  component: Link,
};

export const LinkList = {
  args: {
    attributes: {},
    variant: 'link-list',
    title: 'Select Language',
    links: [
      { title: 'English', href: '/en' },
      { title: 'Français', href: '/fr', active: true },
      { title: 'Español', href: '/es' },
    ],
  },
};

export const Dropdown = {
  args: {
    attributes: {},
    variant: 'dropdown',
    title: 'Select Language',
    links: [
      { title: 'English', href: '/en' },
      { title: 'Français', href: '/fr', active: true },
      { title: 'Español', href: '/es' },
    ],
  },
};
