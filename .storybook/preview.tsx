import type { Preview } from '@storybook/nextjs-vite'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { useEffect } from 'react'
import { themes } from 'storybook/theming'
import { useDarkMode } from 'storybook-dark-mode'
import '../src/app/globals.css'
import './pretendard.css'

function ThemeSync({ children }: { children: React.ReactNode }) {
  const isDark = useDarkMode();

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  return children;
}

function ThemedDocsContainer(props: DocsContainerProps) {
  const isDark = useDarkMode();
  return <DocsContainer {...props} theme={isDark ? themes.dark : themes.light} />;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    darkMode: {
      current: 'light',
    },
    docs: {
      container: ThemedDocsContainer,
    },
  },
  decorators: [(Story) => <ThemeSync><Story /></ThemeSync>],
};

export default preview;
