import SiteHeader from './site-header.twig';
import './site-header.scss';
import './site-header.js';

import Logo from '../../components/logo/logo.twig';
import Menu from '../../components/menu/menu.twig';
import LanguageSwitcher from '../../components/language-switcher/language-switcher.twig';
import UserMenu from '../../components/user-menu/user-menu.twig';
import '../../components/language-switcher/language-switcher.js';
import '../../components/user-menu/user-menu.js';

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
      description: 'Legacy main navigation slot.',
    },
    desktop_mainnavigation: {
      control: false,
      description: 'Desktop main navigation slot.',
    },
    mobile_mainnavigation: {
      control: false,
      description: 'Mobile main navigation slot.',
    },
    desktop_languageswitcher: {
      control: false,
      description: 'Desktop language switcher slot.',
    },
    mobile_languageswitcher: {
      control: false,
      description: 'Mobile language switcher slot.',
    },
    desktop_usermenu: {
      control: false,
      description: 'Desktop user menu slot.',
    },
    mobile_usermenu: {
      control: false,
      description: 'Mobile user menu slot.',
    },
    login_url: {
      control: { type: 'text' },
      description: 'Fallback login URL for anonymous users.',
    },
    login_label: {
      control: { type: 'text' },
      description: 'Fallback login label for anonymous users.',
    },
    is_logged_in: {
      control: { type: 'boolean' },
      description: 'Whether the current user is authenticated.',
    },
    show_cart: {
      control: { type: 'boolean' },
      description: 'Whether the cart icon should be shown.',
    },
    cart_count: {
      control: { type: 'number' },
      description: 'Current shopping cart item count.',
    },
    cart_url: {
      control: { type: 'text' },
      description: 'Shopping cart URL.',
    },
    cart_label: {
      control: { type: 'text' },
      description: 'Accessible cart label.',
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

const mobileMainMenuArgs = {
  attributes: {},
  name: 'Main Menu',
  orientation: 'vertical',
  links: [
    { title: 'Work', href: '/', active: true },
    { title: 'About', href: '/about', active: false },
    { title: 'Shop', href: '/shop', active: false },
  ],
};

const desktopLanguageSwitcherArgs = {
  variant: 'dropdown',
  title: 'Select Language',
  links: [
    { title: 'Nederlands', href: '/nl', active: true },
    { title: 'English', href: '/en' },
  ],
};

const mobileLanguageSwitcherArgs = {
  variant: 'link-list',
  title: 'Select Language',
  links: [
    { title: 'Nederlands', href: '/nl', active: true },
    { title: 'English', href: '/en' },
  ],
};

const desktopUserMenuArgs = {
  variant: 'dropdown',
  title: 'My account',
  links: [
    { title: 'My orders', href: '/en/user/1/orders' },
    { title: 'My account', href: '/user' },
    { title: 'Logout', href: '/user/logout' },
  ],
};

const mobileUserMenuArgs = {
  variant: 'link-list',
  title: 'My account',
  links: [
    { title: 'My orders', href: '/en/user/1/orders' },
    { title: 'My account', href: '/user' },
    { title: 'Logout', href: '/user/logout' },
  ],
};

const mobileGuestMenuArgs = {
  variant: 'link-list',
  title: 'Login',
  links: [
    { title: 'Login', href: '/user/login' },
  ],
};

export const Default = {
  args: {
    attributes: {},
    branding: Logo(logoArgs),
    desktop_mainnavigation: Menu(mainMenuArgs),
    mobile_mainnavigation: Menu(mobileMainMenuArgs),
    desktop_languageswitcher: LanguageSwitcher(desktopLanguageSwitcherArgs),
    mobile_languageswitcher: LanguageSwitcher(mobileLanguageSwitcherArgs),
    mobile_usermenu: UserMenu(mobileGuestMenuArgs),
    login_url: '/user/login',
    login_label: 'Login',
    show_cart: true,
    cart_count: 2,
    cart_url: '/cart',
    is_logged_in: false,
  },
};

export const LoggedIn = {
  args: {
    attributes: {},
    branding: Logo(logoArgs),
    desktop_mainnavigation: Menu(mainMenuArgs),
    mobile_mainnavigation: Menu(mobileMainMenuArgs),
    desktop_languageswitcher: LanguageSwitcher(desktopLanguageSwitcherArgs),
    mobile_languageswitcher: LanguageSwitcher(mobileLanguageSwitcherArgs),
    desktop_usermenu: UserMenu(desktopUserMenuArgs),
    mobile_usermenu: UserMenu(mobileUserMenuArgs),
    login_url: '/user/login',
    login_label: 'Login',
    show_cart: true,
    cart_count: 2,
    cart_url: '/cart',
    is_logged_in: true,
  },
};
