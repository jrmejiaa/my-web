import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CoverFigure from './CoverFigure';

const REQUIRED_FIELDS = ['image', 'imageModel', 'imagePrompt', 'imageStyle'];

/**
 * Manual cover for a tutorial/doc.
 *
 * Thin data wrapper around {@link CoverFigure}, placed by the author via an
 * explicit import in a doc that should carry a cover (most docs should not).
 * It owns only the docs-particular concerns: reading `useDoc()`, resolving the
 * image from the absolute `frontMatter.image` static path (docs covers live in
 * the mirrored `static/` tree, so the raw string is already a valid <img src>),
 * and warning visibly in development when a required field is missing.
 *
 * The visible dev placeholder exists because placement here is deliberate: a
 * missing field is almost certainly an authoring mistake, and silent nothing
 * would be easy to miss right after adding the tag. In production it degrades
 * to rendering nothing.
 */
export default function DocCover() {
  const {metadata, frontMatter} = useDoc();
  const {image, imageModel, imagePrompt, imageStyle} = frontMatter;

  const missing = REQUIRED_FIELDS.filter((field) => !frontMatter[field]);
  if (missing.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `<DocCover /> is present but these cover frontmatter field(s) are ` +
          `missing: ${missing.join(', ')}. The cover will not render in production.`,
      );
      return (
        <div
          style={{
            margin: '0 0 2rem',
            padding: '0.75rem 1rem',
            border: '2px dashed var(--ifm-color-danger)',
            borderRadius: 'var(--ifm-global-radius)',
            color: 'var(--ifm-color-danger)',
            fontSize: '0.85rem',
          }}>
          <strong>DocCover:</strong> missing frontmatter field(s):{' '}
          {missing.join(', ')}.
        </div>
      );
    }
    return null;
  }

  return (
    <CoverFigure
      src={image}
      title={metadata.title}
      imageModel={imageModel}
      imagePrompt={imagePrompt}
      imageStyle={imageStyle}
    />
  );
}
