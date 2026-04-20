import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import TerminalHero from '@site/src/components/TerminalHero';
import styles from './index.module.css';

const FEATURED_POSTS = [
  {
    title: 'Why you should use devtool on Yocto',
    summary: 'Stop reinventing the wheel — devtool makes cross-compilation development easy.',
    tags: ['yocto', 'linux', 'cross-compilation'],
    href: '/blog/why-you-should-use-devtool-on-yocto',
  },
  {
    title: 'Five things you need to know about working with Yocto',
    summary: 'Key lessons from years of building production embedded Linux images.',
    tags: ['yocto', 'linux'],
    href: '/blog/five-things-you-need-to-know-about-working-with-yocto',
  },
  {
    title: 'Why you need to use pkgconfig for your own libraries',
    summary: 'A better way to manage compiler and linker flags across projects.',
    tags: ['linux', 'cross-compilation'],
    href: '/blog/Why-you-need-to-use-pkgconfig-for-your-own-libs',
  },
];

const SKILLS = [
  {
    group: 'Build Systems',
    items: ['Yocto / OpenEmbedded', 'Bitbake', 'kas', 'CMake', 'Makefile'],
  },
  {
    group: 'System Programming',
    items: ['C / C++', 'IPC (sockets)', 'Linux Kernel', 'ZMQ', 'Serial (UART, SPI, I2C)', 'Multithreading'],
  },
  {
    group: 'Automation & Testing',
    items: ['Python', 'Bash', 'CI/CD Pipelines', 'Docker', 'Hardware-in-the-Loop', 'Package test on Yocto'],
  },
  {
    group: 'Linux Userspace',
    items: ['systemd', 'D-Bus', 'udev', 'epoll', 'iptables / nftables', 'strace', 'SWUpdate'],
  },
];

export default function Home() {
  return (
    <Layout
      title="Home"
      description="Jairo R. Mejia Aponte — Embedded Software Engineer specializing in Yocto, Linux, and C/C++">

      {/* Hero */}
      <TerminalHero />

      {/* About Blurb */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.sectionLabel}>// about</div>
          <p className={styles.aboutText}>
            I'm Jairo — an Embedded Software Engineer who turns hardware specs into
            production Linux systems. I work across the full stack from kernel bring-up
            to userspace daemons, with a focus on Yocto-based build pipelines. This site
            is where I share what I learn and document the things I wish someone had
            written down for me.
          </p>
          <Link to="/about" className={styles.aboutLink}>
            More about me →
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className={styles.postsSection}>
        <div className={styles.postsInner}>
          <h2 className={styles.sectionTitle}>Featured Posts</h2>
          <div className={styles.postsGrid}>
            {FEATURED_POSTS.map((post) => (
              <Link key={post.href} to={post.href} className={styles.postCard}>
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
          <Link to="/blog" className={styles.viewAll}>
            View all posts →
          </Link>
        </div>
      </section>

      {/* Skills */}
      <section className={styles.skillsSection}>
        <div className={styles.skillsInner}>
          <h2 className={styles.sectionTitle}>Skills & Tools</h2>
          <div className={styles.skillsGrid}>
            {SKILLS.map((group) => (
              <div key={group.group} className={styles.skillGroup}>
                <div className={styles.skillGroupTitle}>{group.group}</div>
                <div className={styles.chips}>
                  {group.items.map((item) => (
                    <span key={item} className={styles.chip}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
