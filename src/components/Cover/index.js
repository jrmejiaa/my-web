export {default as CoverFigure} from './CoverFigure';
export {default as BlogCover} from './BlogCover';
export {default as DocCover} from './DocCover';

// Default export keeps the historical `@site/src/components/Cover` import
// resolving to the automatic blog cover.
export {default} from './BlogCover';
