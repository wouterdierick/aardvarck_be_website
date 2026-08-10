import Metadata from './metadata.twig';
import './metadata.scss';

export default {
  title: 'Components/Organisms/Metadata',
  parameters: {
    docs: {
      description: {
        component: 'Metadata component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    attributes: {
      control: { type: 'object' },
      description: 'Additional HTML attributes (for example: class, id, data-*)',
    },
    items: {
      control: { type: 'object' },
      description: 'Array of fields with label and value.',
    },
  },
  component: Metadata,
};

export const Default = {
  args: {
    attributes: {},
    items: [
      { label: 'Field 1', value: 'Value 1' },
      { label: 'Field 2', value: 'Value 2' },
      { label: 'Field 2', value: 'Value 2' },
    ],
  },
};
