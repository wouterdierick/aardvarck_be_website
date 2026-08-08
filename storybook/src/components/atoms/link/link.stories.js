import Link from './link.twig';
import './link.scss';

export default {
  title: 'Components/Atoms/Link',
  parameters: {
    docs: {
      description: {
        component: 'The link supports inline and standalone navigation actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    title: {
      control: { type: 'text' },
      description: 'Link label',
    },
    url: {
      control: { type: 'text' },
      description: 'Link URL',
    },
  },
  component: Link,
};

export const Default = {
  args: {
    attributes: {},
    title: 'Primary Link',
    url: '#',
  },
};
