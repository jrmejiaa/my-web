import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import TerminalHero from '@site/src/components/TerminalHero';
import Button from '@site/src/components/Button';
import useFeaturedContent from '@site/src/components/useFeaturedContent';
import styles from './index.module.css';

// Ordered permalinks of the posts to feature. The first entry renders as the
// big featured card; the rest fill the grid. Title, summary, tags, and date
// come from each post's frontmatter via the content index — this list only
// decides *which* posts appear and in what order.
const FEATURED_POST_PERMALINKS = [
  '/blog/five-things-you-need-to-know-about-working-with-yocto',
  '/blog/why-you-should-use-devtool-on-yocto',
  '/blog/Why-I-use-Yocto-over-Buildroot',
  '/blog/Why-you-need-to-use-pkgconfig-for-your-own-libs',
  '/blog/My-developer-setup-and-some-hidden-terminal-gems',
];

// Ordered permalinks of the docs to feature. First entry = big featured card.
const FEATURED_DOC_PERMALINKS = [
  '/docs/yocto/debugging_yocto',
  '/docs/yocto/how-to-use-devtool-to-create-and-test-apps',
  '/docs/yocto/how-to-create-plugins-for-devtool-in-yocto',
  '/docs/linux/how-to-use-pkgconfig',
  '/docs/yocto/how-to-start-with-yocto-in-qemu',
];

// The content index serializes dates as ISO strings; cards show just the day.
function formatDate(date) {
  return typeof date === 'string' ? date.slice(0, 10) : '';
}

const DOC_LINKS = [
  { label: '~/yocto', href: '/docs/yocto/welcome-yocto' },
  { label: '~/linux', href: '/docs/linux/welcome-linux' },
  { label: '~/coding', href: '/docs/coding/c_cpp/welcome-c-cpp' },
];

const SKILLS = [
  'Yocto / OpenEmbedded', 'Bitbake', 'kas', 'CMake', 'Makefile',
  'C / C++', 'Python', 'Bash', 'Linux Kernel', 'systemd',
  'LTE / 5G', 'WiFi', 'GPS', 'D-Bus', 'udev', 'Serial (UART, SPI, I2C)',
  'SWUpdate', 'Git', 'Docker', 'CI/CD Pipelines', 'Jenkins'
];

const STATS = [
  { label: 'EXPERIENCE', value: '4+ years' },
  { label: 'INDUSTRY', value: 'Railway & Vehicle Networking' },
  { label: 'COMMUNICATIONS', value: 'LTE · 5G · WiFi · GPS' },
  { label: 'STACK', value: 'Yocto · Linux Kernel · C/C++' },
  { label: 'DEPLOYED', value: 'Production embedded devices' },
];

export default function Home() {
  const featuredPosts = useFeaturedContent(FEATURED_POST_PERMALINKS, 'posts');
  const featuredDocs = useFeaturedContent(FEATURED_DOC_PERMALINKS, 'docs');

  return (
    <Layout
      title="Home"
      description="Jairo R. Mejia Aponte — Embedded Software Engineer specializing in Yocto, Linux, and C/C++">

      {/* Hero — split layout */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.roleLabel}>Embedded Software Engineer</div>
            <div className={styles.nameLabel}>Jairo R. Mejia Aponte</div>
            <h1 className={styles.headline}>
              I build embedded Linux <br />
              <span className={styles.headlineAccent}>from bootloader to userspace.</span>
            </h1>
            <p className={styles.heroDescription}>
              From BitBake recipes to userspace daemons — I build embedded Linux
              systems for connected industrial devices. I document what I learn
              — the kind of detail that doesn't fit in a README.
            </p>
            <div className={styles.heroCtas}>
              <Button variant="primary" to="/blog">Read the blog</Button>
              <Button variant="secondary" href="/files/cv.pdf" icon="↓">
                Download CV
              </Button>
            </div>
          </div>
          <div className={styles.heroTerminal}>
            <TerminalHero />
          </div>
        </div>
      </section>

      {/* About — bio + skills left, stats terminal right */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.sectionLabel}>// about</div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutLeft}>
              <p className={styles.aboutText}>
                I work on Yocto-based Linux systems for industrial networking devices
                — railway routers, vehicle gateways, and connectivity platforms running
                LTE, 5G, WiFi, and GPS. My day-to-day spans from writing BitBake recipes
                and configuring layers to building userspace services with C/C++ and
                systemd.
              </p>
              <p className={styles.aboutText}>
                This site is where I document the things I learn — the kind of practical
                detail that's hard to find when you're debugging a recipe at 2 AM.
              </p>
              <div className={styles.skillPills}>
                {SKILLS.map((s) => (
                  <span key={s} className={styles.pill}>{s}</span>
                ))}
              </div>
            </div>
            <div className={styles.statsTerminal}>
              <div className={styles.statsHeader}>$ cat stats.txt</div>
              <dl className={styles.statsList}>
                {STATS.map((s) => (
                  <div key={s.label} className={styles.statRow}>
                    <dt className={styles.statLabel}>{s.label}</dt>
                    <dd className={styles.statValue}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className={styles.postsSection}>
        <div className={styles.postsInner}>
          <div className={styles.sectionLabel}>// featured posts</div>
          <div className={styles.postsGrid}>
            {featuredPosts.map((post, i) => (
              <Link
                key={post.permalink}
                to={post.permalink}
                className={`${styles.postCard} ${i === 0 ? styles.postCardFeatured : ''}`}
              >
                <div className={styles.postDateRow}>
                  <span className={styles.postDate}>{formatDate(post.date)}</span>
                  <span className={styles.postDateLine} />
                  {i === 0 && <span className={styles.postFeaturedLabel}>Featured</span>}
                </div>
                <div className={styles.postTitle}>{post.title}</div>
                <div className={styles.postSummary}>{post.description}</div>
                <div className={styles.postTags}>
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <Link to="/blog" className={styles.viewAll}>View all posts →</Link>
        </div>
      </section>

      {/* Featured Docs */}
      <section className={styles.docsSection}>
        <div className={styles.postsInner}>
          <div className={styles.sectionLabel}>// featured docs</div>
          <div className={styles.postsGrid}>
            {featuredDocs.map((doc, i) => (
              <Link
                key={doc.permalink}
                to={doc.permalink}
                className={`${styles.postCard} ${i === 0 ? styles.docCardFeatured : ''}`}
              >
                <div className={styles.postDateRow}>
                  <span className={styles.docPath}>{doc.section}</span>
                  <span className={styles.postDateLine} />
                  {i === 0 && <span className={styles.postFeaturedLabel}>Tutorial</span>}
                </div>
                <div className={styles.postTitle}>{doc.title}</div>
                <div className={styles.postSummary}>{doc.description}</div>
                <div className={styles.postTags}>
                  {doc.tags.slice(0, 3).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.docsLinks}>
            {DOC_LINKS.map((link, i) => (
              <React.Fragment key={link.href}>
                {i > 0 && <span className={styles.docsLinkDivider} />}
                <Link to={link.href} className={styles.docsLink}>{link.label}</Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
