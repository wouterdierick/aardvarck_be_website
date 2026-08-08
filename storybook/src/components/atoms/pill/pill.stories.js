import Pill from './pill.twig';
import './pill.scss';

export default {
  title: 'Components/Atoms/Pill',
  parameters: {
    docs: {
      description: {
        component: 'The pill highlights compact metadata, categories, or short actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    label: {
      control: { type: 'text' },
      description: 'Pill label',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon id. Leave empty to hide the icon.',
    },
    href: {
      control: { type: 'text' },
      description: 'Optional link URL. When empty, the pill renders as a span.',
    },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary'],
      description: 'Pill style variant',
    },
  },
  component: Pill,
};

export const Neutral = {
  args: {
    attributes: {},
    label: 'Neutral pill',
    icon: 'tag',
    href: '',
    variant: 'neutral',
  },
};

export const Primary = {
  args: {
    attributes: {},
    label: 'Primary pill',
    icon: 'check',
    href: '',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    attributes: {},
    label: 'Secondary pill',
    icon: 'info',
    href: '',
    variant: 'secondary',
  },
};

export const Linked = {
  args: {
    attributes: {},
    label: 'Linked pill',
    icon: 'external-link',
    href: 'https://www.example.com',
    variant: 'primary',
  },
};
