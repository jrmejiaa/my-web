import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

const HIGHLIGHTS = [
  'Designed and maintained Yocto-based BSPs for production embedded Linux devices',
  'Built custom Linux distributions targeting ARM and x86 platforms',
  'Developed userspace daemons and system services with C/C++ and systemd',
  'Implemented CI/CD pipelines for automated image builds and testing',
  'Contributed to cross-team tooling that reduced build iteration time significantly',
];

export default function About() {
  return (
    <Layout title="About" description="About Jairo R. Mejia Aponte — Embedded Software Engineer">
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.sectionLabel}>// about</div>
          <h1 className={styles.heading}>Jairo R. Mejia Aponte</h1>

          <div className={styles.bio}>
            <p>
              I'm an Embedded Software Engineer with 4+ years of experience building
              Linux-based systems for production hardware. My day-to-day revolves around
              Yocto and Linux Embedded devices — from writing recipes and configuring
              BSP layers to debugging kernel modules and optimizing boot times.
            </p>
            <p>
              Before specializing in embedded Linux, I studied electronics engineering in
              Colombia and later completed my master's in Germany, where I deepened my
              understanding of real-time systems and hardware-software co-design. That
              background gives me a perspective that spans from register-level hardware
              to high-level build orchestration.
            </p>
            <p>
              I started this site as a personal knowledge base — a place to document the
              things I learn so I don't have to re-learn them. Over time it became
              something I hope is useful to other engineers navigating the same problems.
              If you find something helpful here, that's the best outcome I could ask for.
            </p>
          </div>

          <h2 className={styles.subheading}>Career Highlights</h2>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item, i) => (
              <li key={i} className={styles.highlightItem}>{item}</li>
            ))}
          </ul>

          <div className={styles.cvSection}>
            <a
              href="/files/cv.pdf"
              className={styles.cvButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV ↓
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
