import SiteFooter from './site-footer.twig';
import './site-footer.scss';
import Menu from '../../components/menu/menu.twig';

export default {
  title: 'Sections/Site Footer',
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
    footernavigation: {
      control: false,
      description: 'Footer navigation slot.',
    },
  },

  component: SiteFooter,
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
