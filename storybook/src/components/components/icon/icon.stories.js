import Icon from './icon.twig';
import './icon.scss';

export default {
  title: 'Components/Icon',
  parameters: {
    docs: {
      description: {
        component: 'The icon atom renders inline SVG markup from a file in the component icons folder.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    id: {
      control: { type: 'text' },
      description: 'Icon id. This matches the SVG filename without the .svg extension.',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Icon size.',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessible label. Leave empty for decorative icons.',
    },
  },
  component: Icon,
};

export const Default = {
  args: {
    attributes: {},
    id: 'check',
    size: 'medium',
    label: '',
  },
};

export const Sizes = {
  render: () => `
    <div style="display: flex; align-items: center; gap: 1rem;">
      ${Icon({ attributes: {}, id: 'check', size: 'small', label: '' })}
      ${Icon({ attributes: {}, id: 'check', size: 'medium', label: '' })}
      ${Icon({ attributes: {}, id: 'check', size: 'large', label: '' })}
    </div>
  `,
};
