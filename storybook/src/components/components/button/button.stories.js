import Button from './button.twig';
import './button.scss';

export default {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component: 'The button triggers primary and secondary user interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    element: {
      control: { type: 'select' },
      options: ['button', 'input', 'a'],
      description: 'HTML element used to render the button',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Button/input type when element is "button" or "input"',
    },
    title: {
      control: { type: 'text' },
      description: 'Button text',
    },
    href: {
      control: { type: 'text' },
      description: 'Link destination when element is "a"',
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'danger', 'ghost'],
      description: 'Button style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'small', 'large'],
      description: 'Button size variant',
    },
    layout: {
      control: { type: 'select' },
      options: ['icon-label', 'label-icon', 'icon-only', 'label-only'],
      description: 'Button content layout variant',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state (uses disabled on button/input, aria-disabled on links)',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Accessible label override',
    },
    icon_id: {
      control: { type: 'text' },
      description: 'Icon ID.',
    },
  },
  component: Button,
};

export const Default = {
  args: {
    attributes: {},
    element: 'button',
    title: 'Default Button',
    href: '#',
    icon_id: 'upload',
    type: 'button',
    disabled: false,
    aria_label: '',
  },
};

export const Primary = {
  args: {
    attributes: {},
    element: 'button',
    title: 'Primary Button',
    href: '#',
    icon_id: 'mail',
    color: 'primary',
    type: 'button',
    disabled: false,
    aria_label: '',
  },
};

export const Secondary = {
  args: {
    attributes: {},
    element: 'button',
    title: 'Secondary Button',
    href: '#',
    icon_id: 'cart',
    color: 'secondary',
    type: 'button',
    disabled: false,
    aria_label: '',
  },
};

export const Danger = {
  args: {
    attributes: {},
    element: 'button',
    title: 'Danger Button',
    href: '#',
    icon_id: 'trash',
    color: 'danger',
    type: 'button',
    disabled: false,
    aria_label: '',
  },
};
