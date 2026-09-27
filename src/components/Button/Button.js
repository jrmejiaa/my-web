import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Button.module.css';

/**
 * Shared call-to-action button, the single source of truth for button styling
 * and link behavior across the site (landing hero, About page, etc.).
 *
 * Styling is driven by `variant`:
 *   - `primary`   — solid primary fill; the dominant action on a page.
 *   - `secondary` — neutral outline that resolves to the primary color on
 *                   hover; the supporting action.
 *
 * Link behavior is chosen by which target prop is passed, so callers never
 * hand-roll `target`/`rel` and the two can't drift out of sync:
 *   - `to`   — an internal route, rendered via Docusaurus `<Link>` (same tab).
 *   - `href` — an external URL or static file, rendered as a plain `<a>` that
 *              always opens in a new tab with `rel="noopener noreferrer"`.
 *
 * `icon` is an optional trailing glyph (e.g. '↓' for a download, '↗' for an
 * external link). It is per-call, not per-variant: a primary button may or may
 * not carry a glyph.
 */
export default function Button({
  variant = 'primary',
  to,
  href,
  icon,
  className,
  children,
  ...rest
}) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
      {icon && <span className={styles.icon}>{icon}</span>}
    </>
  );

  // Internal route → Docusaurus <Link> (client-side nav, same tab).
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  // External URL or static file → plain <a>, always new tab + safe rel.
  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}>
      {content}
    </a>
  );
}
