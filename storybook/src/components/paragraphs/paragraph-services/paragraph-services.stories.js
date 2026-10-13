import ParagraphServices from './paragraph-services.twig';
import './paragraph-services.scss';

export default {
  title: 'Paragraphs/Services',
  parameters: {
    docs: {
      description: {
        component: 'Services paragraph with a responsive grid of equal-height title-and-text cards.',
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
      description: 'Optional section title.',
    },
    items: {
      control: { type: 'object' },
      description: 'Array of service items with title and body.',
    },
  },
  component: ParagraphServices,
};

export const Default = {
  args: {
    attributes: {},
    title: 'Services',
    items: [
      {
        title: 'Visual brand identity',
        body: 'Logos and brand identities — everything that makes a brand visually strong.',
      },
      {
        title: 'Illustration',
        body: 'Illustrations for print, web, or other applications.',
      },
      {
        title: 'Print & layout',
        body: 'Posters, booklets, leaflets — from design to print-ready file.',
      },
      {
        title: 'Web design & front-end',
        body: 'Visually strong websites that work technically too.',
      },
    ],
  },
};
