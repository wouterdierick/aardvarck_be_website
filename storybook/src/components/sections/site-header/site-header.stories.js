import SiteHeader from './site-header.twig';
import './site-header.scss';
import Logo from '../../components/logo/logo.twig';
import Menu from '../../components/menu/menu.twig';

export default {
  title: 'Sections/Site Header',
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

const logoArgs = {
  args: {
    attributes: {},
    title: 'Home',
    href: '/',
    color: 'primary',
    size: 'large',
  },
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
    branding: Logo(logoArgs),
    mainnavigation: Menu(menuArgs),
  },
};
