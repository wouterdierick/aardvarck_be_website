import WorkMasonry from './work-masonry.twig';
import './work-masonry.scss';
import './work-masonry.js';
import Card from '../../components/card/card.twig';
import Image from '../../components/image/image.twig';

export default {
  title: 'Sections/Work Masonry',
  parameters: {
    docs: {
      description: {
        component: 'Distributes direct child content across responsive masonry columns.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional attributes. Use data-work-masonry-tablet and data-work-masonry-desktop to set breakpoints in pixels.',
    },
    items: {
      control: false,
      description: 'Array of cards or other rendered content to distribute across the columns.',
    },
    html: {
      control: false,
      description: 'Optional rendered HTML whose direct children are distributed across the columns. Takes precedence over items.',
    },
  },
  component: WorkMasonry,
};

const imageSizes = [
  [600, 300], [600, 600], [600, 400], [900, 450], [300, 300],
  [1200, 800], [600, 400], [900, 900], [300, 200], [1200, 600],
  [600, 300], [600, 600], [600, 400], [900, 450], [300, 300],
  [1200, 800], [600, 400], [900, 900], [300, 200], [1200, 600],
];

const items = imageSizes.map(([width, height], index) => Card({
  attributes: {},
  title: `Work item ${index + 1}`,
  content: 'A short placeholder description for this work item.',
  image: Image({
    src: `blue_${width}x${height}.jpg`,
    alt: `Placeholder for work item ${index + 1}`,
    width,
    height,
    rounded: false,
  }),
  link: '#',
  tags: [],
}));

export const Default = {
  args: {
    attributes: {
      'data-work-masonry-tablet': '768',
      'data-work-masonry-desktop': '1024',
    },
    items,
    html: '',
  },
};
