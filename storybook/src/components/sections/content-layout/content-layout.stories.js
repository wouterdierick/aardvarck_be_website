import ContentLayout from './content-layout.twig';
import './content-layout.scss';

export default {
  title: 'Sections/Content Layout',
  parameters: {
    docs: {
      description: {
        component: 'Layout container component for paragraph layouts and layout paragraphs regions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*).',
    },
    variant: {
      control: { type: 'select' },
      options: ['cols-1', 'cols-2', 'cols-3', 'cols-4'],
      description: 'Column layout variant.',
    },
    col_1: {
      control: { type: 'object' },
      description: 'First column content.',
    },
    col_2: {
      control: { type: 'object' },
      description: 'Second column content.',
    },
    col_3: {
      control: { type: 'object' },
      description: 'Third column content.',
    },
    col_4: {
      control: { type: 'object' },
      description: 'Fourth column content.',
    },
  },
  component: ContentLayout,
};

export const TwoColumns = {
  args: {
    attributes: {},
    variant: 'cols-2',
    col_1: 'Column one content',
    col_2: 'Column two content',
  },
};

export const ThreeColumns = {
  args: {
    attributes: {},
    variant: 'cols-3',
    col_1: 'Column one content',
    col_2: 'Column two content',
    col_3: 'Column three content',
  },
};
