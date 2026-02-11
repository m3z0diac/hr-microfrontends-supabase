declare namespace JSX {
  interface IntrinsicElements {
    // This tells React that <employee-root> is a valid HTML tag
    'employee-root': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
