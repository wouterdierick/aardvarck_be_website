import Text from './text.twig';
import './text.scss';

export default {
  title: 'Paragraphs/Text',
  parameters: {
    docs: {
      description: {
        component: 'Text paragraph component for regular body text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*).',
    },
    content: {
      control: { type: 'object' },
      description: 'Rendered text content.',
    },
  },
  component: Text,
};

export const Default = {
  args: {
    attributes: {},
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>',
  },
};
