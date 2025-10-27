// Prevent Next.js CSS insertion error
if (!document.querySelector('#__next_css__DO_NOT_USE__')) {
  const styleNode = document.createElement('style');
  styleNode.id = '__next_css__DO_NOT_USE__';
  document.head.appendChild(styleNode);
}

export {};
