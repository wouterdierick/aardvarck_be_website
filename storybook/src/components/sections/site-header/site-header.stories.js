import SiteHeader from './site-header.twig';
import './site-header.scss';
import './site-header.js';

import '../../components/logo/logo.scss';
import '../../components/menu/menu.scss';
import '../../components/language-switcher/language-switcher.scss';
import '../../components/user-menu/user-menu.scss';
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
      control: { type: 'object' },
      description: 'Branding component props.',
    },
    desktop_mainnavigation: {
      control: { type: 'object' },
      description: 'Desktop main navigation props.',
    },
    mobile_mainnavigation: {
      control: { type: 'object' },
      description: 'Mobile main navigation props.',
    },
    desktop_languageswitcher: {
      control: { type: 'object' },
      description: 'Desktop language switcher props.',
    },
    mobile_languageswitcher: {
      control: { type: 'object' },
      description: 'Mobile language switcher props.',
    },
    desktop_usermenu: {
      control: { type: 'object' },
      description: 'Desktop user menu props.',
    },
    mobile_usermenu: {
      control: { type: 'object' },
      description: 'Mobile user menu props.',
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
    branding: logoArgs,
    desktop_mainnavigation: mainMenuArgs,
    mobile_mainnavigation: mobileMainMenuArgs,
    desktop_languageswitcher: desktopLanguageSwitcherArgs,
    mobile_languageswitcher: mobileLanguageSwitcherArgs,
    mobile_usermenu: mobileGuestMenuArgs,
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
    branding: logoArgs,
    desktop_mainnavigation: mainMenuArgs,
    mobile_mainnavigation: mobileMainMenuArgs,
    desktop_languageswitcher: desktopLanguageSwitcherArgs,
    mobile_languageswitcher: mobileLanguageSwitcherArgs,
    desktop_usermenu: desktopUserMenuArgs,
    mobile_usermenu: mobileUserMenuArgs,
    login_url: '/user/login',
    login_label: 'Login',
    show_cart: true,
    cart_count: 2,
    cart_url: '/cart',
    is_logged_in: true,
  },
};
