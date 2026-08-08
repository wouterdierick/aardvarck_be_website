
// Import storybook specific styles.
import '../src/docs/styles.css';

// Import global theme styles.
import '../src/styles/main.scss';

// Import component styles.
const componentStyles = import.meta.glob('../src/components/**/*.scss', { eager: true });

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Colors',
          'Components',
          ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
        ],
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  tags: ['autodocs'],
};

export default preview;
