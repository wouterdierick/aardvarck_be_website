
import Card from './card.twig';
import './card.scss';
import Image from '../../atoms/image/image.twig';

export default {
  title: 'Components/Organisms/Card',
  parameters: {
    docs: {
      description: {
        component: 'The card groups a title with supporting body content.',
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
      description: 'Card title',
    },
    content: {
      control: { type: 'text' },
      description: 'Card content',
    },
    image: {
      control: false,
      description: 'Image slot (uses Image component)',
    },
    link: {
      control: { type: 'text' },
      description: 'If set, the card is fully clickable as a link.',
    },
    tags: {
      control: { type: 'object' },
      description: 'Array of tag objects with label (required) and url (optional)',
    },
  },
  component: Card,
};


const imageArgs = {
  src: 'blue_600x400.jpg',
  alt: 'Dummy image',
  width: 600,
  height: 400,
  rounded: false,
};

export const Default = {
  args: {
    attributes: {},
    title: 'Card Title',
    content: 'This is the card content.',
    image: '',
    link: '',
    tags: [
      { label: 'Article', url: '' },
      { label: 'Blog', url: '' },
    ],
  },
};

export const WithImage = {
  args: {
    attributes: {},
    title: 'Card with image',
    content: 'This card displays an image at the top.',
    image: Image(imageArgs),
    link: '',
    tags: [
      { label: 'Article', url: '' },
      { label: 'Blog', url: '' },
    ],
  },
};

export const ClickableCard = {
  args: {
    attributes: {},
    title: 'Clickable Card',
    content: 'The entire card is clickable because the link argument is set.',
    image: Image(imageArgs),
    link: 'https://www.example.com',
    tags: [
      { label: 'Article', url: 'https://example.com/articles' },
    ],
  },
};
