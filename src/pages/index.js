import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import TerminalHero from '@site/src/components/TerminalHero';
import styles from './index.module.css';

const FEATURED_POSTS = [
  {
    title: 'Five things you need to know about working with Yocto',
    summary: 'Building Linux systems is still tough, but Yocto and Buildroot simplify it a lot. The problems of building a Linux embedded device from scratch and why these tools change the game.',
    tags: ['cross-compilation', 'yocto', 'linux'],
    href: '/blog/five-things-you-need-to-know-about-working-with-yocto',
    date: '2025-04-01',
    featured: true,
  },
  {
    title: 'Why you should use devtool on Yocto',
    summary: 'Stop reinventing the wheel — devtool makes cross-compilation development easy.',
    tags: ['cross-compilation', 'yocto', 'linux'],
    href: '/blog/why-you-should-use-devtool-on-yocto',
    date: '2025-05-01',
  },
  {
    title: 'Why I use Yocto over Buildroot as building tool',
    summary: 'As you may get for the title, I will just write why I think Yocto and OpenEmbedded is the right tool for building your custom Linux Embedded systems, even for personal projects.',
    tags: ['cross-compilation', 'yocto', 'linux'],
    href: '/blog/Why-I-use-Yocto-over-Buildroot',
    date: '2025-03-20',
  },
  {
    title: 'Why you need to use pkgconfig for your own libraries',
    summary: 'A better way to manage compiler and linker flags across projects.',
    tags: ['cross-compilation', 'yocto', 'linux'],
    href: '/blog/Why-you-need-to-use-pkgconfig-for-your-own-libs',
    date: '2025-03-27',
  },
  {
    title: 'My developer setup and some hidden terminal gems',
    summary: 'Open-source tools I use daily while developing embedded systems on Linux.',
    tags: ['open-source', 'dev-setup', 'linux'],
    href: '/blog/My-developer-setup-and-some-hidden-terminal-gems',
    date: '2025-03-20',
  },
];

const FEATURED_DOCS = [
  {
    title: 'How to debug applications in Yocto',
    summary: 'Network errors, misordered inherits, and config overrides that silently fail — the debugging gotchas that cost hours, and how to work around them.',
    path: '~/yocto/',
    tags: ['yocto', 'advance-yocto', 'linux'],
    href: '/docs/yocto/debugging_yocto',
    featured: true,
  },
  {
    title: 'How to use devtool to create and test applications on Yocto',
    summary: 'Create a recipe from scratch, build a library, and wire up a ptest package for unit tests — the devtool basics, end to end.',
    path: '~/yocto/',
    tags: ['devtool', 'yocto', 'user-space'],
    href: '/docs/yocto/how-to-use-devtool-to-create-and-test-apps',
  },
  {
    title: 'How to create plugins for devtool in Yocto',
    summary: 'The undocumented part of devtool: how to register your own subcommands and automate repetitive steps in your daily workflow.',
    path: '~/yocto/',
    tags: ['devtool', 'yocto', 'advance-yocto'],
    href: '/docs/yocto/how-to-create-plugins-for-devtool-in-yocto',
  },
  {
    title: 'Using pkgconfig for your custom libraries',
    summary: 'Stop hand-maintaining compiler and linker flags. Generate a .pc file for your shared library and let pkgconfig do the work.',
    path: '~/linux/',
    tags: ['cross-compilation', 'user-space', 'linux'],
    href: '/docs/linux/how-to-use-pkgconfig',
  },
  {
    title: 'How to start with Yocto even without hardware',
    summary: 'A realistic Yocto setup built on Bootlin layers and QEMU — a better starting point than Poky when you are heading toward a real product.',
    path: '~/yocto/',
    tags: ['yocto', 'qemu', 'fundamentals-devtool'],
    href: '/docs/yocto/how-to-start-with-yocto-in-qemu',
  },
];

const DOC_LINKS = [
  { label: '~/yocto', href: '/docs/yocto/welcome' },
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
              <Link to="/blog" className={styles.ctaPrimary}>Read the blog</Link>
              <a
                href="/files/cv.pdf"
                className={styles.ctaSecondary}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV ↓
              </a>
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
            {FEATURED_POSTS.map((post) => (
              <Link
                key={post.href}
                to={post.href}
                className={`${styles.postCard} ${post.featured ? styles.postCardFeatured : ''}`}
              >
                <div className={styles.postDateRow}>
                  <span className={styles.postDate}>{post.date}</span>
                  <span className={styles.postDateLine} />
                  {post.featured && <span className={styles.postFeaturedLabel}>Featured</span>}
                </div>
                <div className={styles.postTitle}>{post.title}</div>
                <div className={styles.postSummary}>{post.summary}</div>
                <div className={styles.postTags}>
                  {post.tags.map((t) => (
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
            {FEATURED_DOCS.map((doc) => (
              <Link
                key={doc.href}
                to={doc.href}
                className={`${styles.postCard} ${doc.featured ? styles.docCardFeatured : ''}`}
              >
                <div className={styles.postDateRow}>
                  <span className={styles.docPath}>{doc.path}</span>
                  <span className={styles.postDateLine} />
                  {doc.featured && <span className={styles.postFeaturedLabel}>Tutorial</span>}
                </div>
                <div className={styles.postTitle}>{doc.title}</div>
                <div className={styles.postSummary}>{doc.summary}</div>
                <div className={styles.postTags}>
                  {doc.tags.map((t) => (
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
