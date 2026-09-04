import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'
import './pretendard.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;