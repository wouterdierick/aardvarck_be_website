import Image from './image.twig';
import './image.scss';

export default {
  title: 'Components/Atoms/Image',
  parameters: {
    docs: {
      description: {
        component: 'The image renders responsive visual content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    src: {
      control: { type: 'text' },
      description: 'Image source URL',
    },
    alt: {
      control: { type: 'text' },
      description: 'Alt text for the image',
    },
    width: {
      control: { type: 'number' },
      description: 'Image width',
    },
    height: {
      control: { type: 'number' },
      description: 'Image height',
    },
    rounded: {
      control: { type: 'boolean' },
      description: 'Whether the image should be rounded',
    },
  },
  component: Image,
};

export const Default = {
  args: {
    attributes: {},
    src: 'blue_600x400.jpg',
    alt: 'Placeholder image',
    rounded: false,
  },
};

export const Rounded = {
  args: {
    attributes: {},
    src: 'blue_600x400.jpg',
    alt: 'Rounded placeholder image',
    rounded: true,
  },
};
