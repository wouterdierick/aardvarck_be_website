import Notification from './notification.twig';
import './notification.scss';
import './notification.js';

export default {
  title: 'Components/Notification',
  parameters: {
    docs: {
      description: {
        component: 'The notification component displays important messages to the user.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    message_type: {
      control: { type: 'select', options: ['info', 'success', 'warning', 'error'] },
      description: 'The type of notification (info, success, warning, error)',
    },
    title: {
      control: { type: 'text' },
      description: 'Notification title',
    },
    message: {
      control: { type: 'text' },
      description: 'Notification message',
    },
    show_close_button: {
      control: { type: 'boolean' },
      description: 'Whether to show a close button or not',
    }
  },
  component: Notification,
};

export const Default = {
  args: {
    attributes: {},
    title: 'Your order has been placed',
    message: 'Donec ullamcorper nulla non metus auctor fringilla.',
    show_close_button: false,
  },
};

export const Info = {
  args: {
    attributes: {},
    message_type: 'info',
    title: 'Your cart is updated',
    message: 'Donec ullamcorper nulla non metus auctor fringilla.',
    show_close_button: true,
  },
};


export const Success = {
  args: {
    attributes: {},
    message_type: 'success',
    title: 'Your order has been placed',
    message: 'Donec ullamcorper nulla non metus auctor fringilla.',
    show_close_button: true,
  },
};

export const Warning = {
  args: {
    attributes: {},
    message_type: 'warning',
    title: 'Item out of stock',
    message: 'Donec ullamcorper nulla non metus auctor fringilla.',
    show_close_button: true,
  },
};


export const Error = {
  args: {
    attributes: {},
    message_type: 'error',
    title: 'Not enough credit',
    message: 'Donec ullamcorper nulla non metus auctor fringilla.',
    show_close_button: true,
  },
};
