import ParagraphImage from './paragraph-image.twig';
import './paragraph-image.scss';

export default {
  title: 'Paragraphs/Image',
  parameters: {
    docs: {
      description: {
        component: 'Image paragraph component for rendered paragraph image content.',
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
      description: 'Rendered image content.',
    },
  },
  component: ParagraphImage,
};

export const Default = {
  args: {
    attributes: {},
    content: '<img src="docs/assets/blue_600x400.jpg" alt="Placeholder image">',
  },
};
