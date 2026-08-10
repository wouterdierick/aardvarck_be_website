import Breadcrumb from './breadcrumb.twig';
import './breadcrumb.scss';

export default {
  title: 'Components/Breadcrumb',
  parameters: {
    docs: {
      description: {
        component: 'Navigation component showing the current page location in a hierarchy. First item is home, last item is the current page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    links: {
      control: { type: 'object' },
      description: 'Array of breadcrumb items. First item is home (can be any URL). Last item is the current page (title only, no link).',
    },
  },
  component: Breadcrumb,
};

export const Default = {
  args: {
    attributes: {},
    links: [
      { title: 'Home', href: '/' },
      { title: 'Products', href: '/products' },
      { title: 'Electronics', href: '/products/electronics' },
      { title: 'Smartphones', href: '#' },
    ],
  },
};

export const SinglePage = {
  args: {
    attributes: {},
    links: [
      { title: 'Home', href: '/' },
      { title: 'Contact', href: '#' },
    ],
  },
};
