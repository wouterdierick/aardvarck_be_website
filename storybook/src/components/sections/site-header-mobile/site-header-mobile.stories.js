import SiteHeaderMobile from './site-header-mobile.twig';
import './site-header-mobile.scss';
import './site-header-mobile.js';

import Logo from '../../components/logo/logo.twig';
import Menu from '../../components/menu/menu.twig';
import LanguageSwitcher from '../../components/language-switcher/language-switcher.twig';
import '../../components/language-switcher/language-switcher.js';

export default {
  title: 'Sections/Site Header Mobile',
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
  component: SiteHeaderMobile,
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
  orientation: 'vertical',
  links: [
    { title: 'Work', href: '/', active: true },
    { title: 'About', href: '/about', active: false },
    { title: 'Shop', href: '/shop', active: false },
  ],
};

const languageSwitcherArgs = {
  attributes: {},
  variant: 'link-list',
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
    mainnavigation: Menu(menuArgs),
    languageswitcher: LanguageSwitcher(languageSwitcherArgs),
  },
};
