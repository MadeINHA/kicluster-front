import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans KR';
    src: local('Noto Sans KR'), url(${require('../resources/fonts/NotoSansKR.ttf')});
  }

  html {
    width: 100%;
    height: 100%;
    min-height: calc(100% + env(safe-area-inset-top));
    overflow-x: hidden;
  }

  body {
    width: 100vw;
    height: 100%;
    font-family: 'Noto Sans KR', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    user-select: none;
  }

  #root {
    min-width: 100%;
    height: 100%;
    min-height: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }
`;
