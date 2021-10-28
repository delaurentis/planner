const FONTS_URL = '/public/fonts';
const fontStack = `
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-Regular.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-Regular.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 400;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-Italic.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-Italic.woff') format('woff');
}


@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 500;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-Medium.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-Medium.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 500;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-MediumItalic.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-MediumItalic.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 600;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-SemiBold.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-SemiBold.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 600;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-SemiBoldItalic.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-SemiBoldItalic.woff') format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 700;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-Bold.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-Bold.woff') format('woff');
}
@font-face {
  font-family: 'Inter';
  font-style:  italic;
  font-weight: 700;
  font-display: swap;
  src: url('${FONTS_URL}/Inter-BoldItalic.woff2') format('woff2'),
       url('${FONTS_URL}/Inter-BoldItalic.woff') format('woff');
}
`;

export const loadFonts = () => {
  const head = document && document.getElementsByTagName('head')[0];
  const style = document && document.createElement('style');

  if (!style || !head) return null;

  style.innerHTML = fontStack;
  return head.appendChild(style);
};

