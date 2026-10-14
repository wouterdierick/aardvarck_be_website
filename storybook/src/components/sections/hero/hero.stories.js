import Hero from './hero.twig';
import './hero.scss';

export default {
  title: 'Sections/Hero',
  parameters: {
    docs: {
      description: {
        component: 'Page hero component that renders the page title in default or full width.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*).',
    },
    title: {
      control: { type: 'text' },
      description: 'Hero title.',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'full'],
      description: 'Hero width variant.',
    },
  },
  component: Hero,
};

export const Default = {
  args: {
    attributes: {},
    title: 'Page title',
    variant: 'default',
  },
};

export const Full = {
  args: {
    attributes: {},
    title: 'Page title',
    variant: 'full',
  },
};
