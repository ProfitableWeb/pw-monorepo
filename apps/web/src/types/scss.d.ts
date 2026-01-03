// TypeScript declarations for SCSS files

// Global SCSS imports (no module exports)
declare module '../../styles/globals.scss';
declare module '@/styles/globals.scss';
declare module '../styles/globals.scss';

// All SCSS files as modules
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

// CSS files
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
