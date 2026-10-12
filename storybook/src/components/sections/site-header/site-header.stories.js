import SiteHeader from './site-header.twig';
import './site-header.scss';
import './site-header.js';

import Logo from '../../components/logo/logo.twig';
import Menu from '../../components/menu/menu.twig';
import LanguageSwitcher from '../../components/language-switcher/language-switcher.twig';
import '../../components/language-switcher/language-switcher.js';

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
    usermenu: {
      control: false,
      description: 'User menu slot.',
    },
  },
  component: SiteHeader,
};

const logoArgs = {
  attributes: {},
  title: 'Home',
  href: '/',
  color: 'primary',
  size: 'medium',
};

const mainMenuArgs = {
  attributes: {},
  name: 'Main Menu',
  links: [
    { title: 'Work', href: '/', active: true },
    { title: 'About', href: '/about', active: false },
    { title: 'Shop', href: '/shop', active: false },
  ],
};

const userMenuArgs = {
  attributes: {},
  name: 'User Menu',
  links: [
    { title: 'Cart', href: '/', icon_id: 'cart', hide_label: true },
    { title: 'Inloggen', href: '/', icon_id: 'user', hide_label: true },
  ],
};

const languageSwitcherArgs = {
  variant: 'dropdown',
  title: 'Select Language',
  links: [
    { title: 'Nederlands', href: '/nl', active: true },
    { title: 'English', href: '/en' },
  ],
};

export const Default = {
  args: {
    attributes: {},
    branding: Logo(logoArgs),
    mainnavigation: Menu(mainMenuArgs),
    languageswitcher: LanguageSwitcher(languageSwitcherArgs),
    usermenu: Menu(userMenuArgs),
  },
};
