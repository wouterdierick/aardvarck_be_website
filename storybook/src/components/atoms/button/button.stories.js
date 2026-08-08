import Button from './button.twig';
import './button.scss';

export default {
  title: 'Components/Atoms/Button',
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
    title: {
      control: { type: 'text' },
      description: 'Button text',
    },
    href: {
      control: { type: 'text' },
      description: 'Link destination when element is "a"',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: 'Button style variant',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Button/input type when element is "button" or "input"',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state (uses disabled on button/input, aria-disabled on links)',
    },
    aria_label: {
      control: { type: 'text' },
      description: 'Accessible label override',
    },
  },
  component: Button,
};

export const Primary = {
  args: {
    attributes: {},
    element: 'button',
    title: 'Primary Button',
    href: '#',
    variant: 'primary',
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
    variant: 'secondary',
    type: 'button',
    disabled: false,
    aria_label: '',
  },
};
