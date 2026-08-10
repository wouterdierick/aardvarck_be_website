import SiteHeader from './site-header.twig';
import './site-header.scss';
import Menu from '../../organisms/menu/menu.twig';

export default {
  title: 'Components/Sections/Site Header',
  parameters: {
    docs: {
      description: {
        component: 'Site header component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
  },
  branding: {
    control: false,
    description: 'Branding slot.',
  },
  mainnavigation: {
    control: false,
    description: 'Main navigation slot.',
  },
  languageswitcher: {
    control: false,
    description: 'Language switcher slot.',
  },
  component: SiteHeader,
};

const menuArgs = {
  attributes: {},
  name: 'Main Menu',
  links: [
    { title: 'Home', href: '/', active: true },
    { title: 'About', href: '/about', active: false },
    { title: 'Services', href: '/services', active: false },
    { title: 'Contact', href: '/contact', active: false },
  ],
};

export const Default = {
  args: {
    attributes: {},
    mainnavigation: Menu(menuArgs),
  },
};
