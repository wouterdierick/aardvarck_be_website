import Sitefooter from './site-footer.twig';
import './site-footer.scss';
import Menu from '../../organisms/menu/menu.twig';

export default {
  title: 'Components/Sections/Site footer',
  parameters: {
    docs: {
      description: {
        component: 'Site footer component.',
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
  component: Sitefooter,
};

const menuArgs = {
  attributes: {},
  name: 'Footer Menu',
  links: [
    { title: 'Cookie policy', href: '/cookie-policy', active: true },
    { title: 'Privacy policy', href: '/privacy-policy', active: false },
    { title: 'Terms & Conditions', href: '/terms-conditions', active: false },
  ],
};

export const Default = {
  args: {
    attributes: {},
    footernavigation: Menu(menuArgs),
  },
};
