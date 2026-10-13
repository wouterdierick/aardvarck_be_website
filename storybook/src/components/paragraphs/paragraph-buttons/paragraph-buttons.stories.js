import ParagraphButtons from './paragraph-buttons.twig';
import './paragraph-buttons.scss';

export default {
  title: 'Paragraphs/Buttons',
  parameters: {
    docs: {
      description: {
        component: 'Paragraph component that renders multiple links as buttons with a description below.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*).',
    },
    buttons: {
      control: { type: 'object' },
      description: 'Array of button links with title, href, optional color, and optional icon.',
    },
    description: {
      control: { type: 'object' },
      description: 'Rendered description content below the buttons.',
    },
  },
  component: ParagraphButtons,
};

export const Default = {
  args: {
    attributes: {},
    buttons: [
      {
        title: 'Contact us',
        href: '#',
        color: 'default',
        icon: 'arrow-right',
      },
      {
        title: 'View projects',
        href: '#',
        color: 'secondary',
        icon: 'link',
      },
    ],
    description: '<p>Supporting text appears below the button row.</p>',
  },
};
