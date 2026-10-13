import Intro from './intro.twig';
import './intro.scss';

export default {
  title: 'Paragraphs/Intro',
  parameters: {
    docs: {
      description: {
        component: 'Intro paragraph component for lead-in content.',
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
      description: 'Rendered intro content.',
    },
  },
  component: Intro,
};

export const Default = {
  args: {
    attributes: {},
    content: '<p>This is a short introduction paragraph with slightly stronger visual weight and a tighter max width.</p>',
  },
};
