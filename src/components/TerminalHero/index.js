import React, { useState, useEffect, useRef } from 'react';
import styles from './TerminalHero.module.css';

const LINES = [
  { prompt: '$ whoami', output: 'Jairo R. Mejia Aponte — Embedded Software Engineer' },
  { prompt: '$ cat /etc/specialization', output: 'Yocto Project | C/C++ | Linux Kernel & Userspace | C/C++ | Python | Bash' },
  { prompt: '$ uptime', output: '4+ years building embedded Linux systems' },
];

const CHAR_DELAY = 35;
const LINE_PAUSE = 400;
const OUTPUT_PAUSE = 200;

export default function TerminalHero() {
  const [displayed, setDisplayed] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const animationRan = useRef(false);

  useEffect(() => {
    if (animationRan.current) return;
    animationRan.current = true;

    let cancelled = false;

    async function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function animate() {
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return;
        const { prompt, output } = LINES[i];

        // Type prompt character by character
        for (let c = 1; c <= prompt.length; c++) {
          if (cancelled) return;
          setDisplayed((prev) => {
            const next = [...prev];
            next[i] = { prompt: prompt.slice(0, c), output: '' };
            return next;
          });
          await sleep(CHAR_DELAY);
        }

        await sleep(OUTPUT_PAUSE);

        // Show output instantly
        if (cancelled) return;
        setDisplayed((prev) => {
          const next = [...prev];
          next[i] = { prompt, output };
          return next;
        });

        if (i < LINES.length - 1) await sleep(LINE_PAUSE);
      }
    }

    animate();
    return () => { cancelled = true; };
  }, []);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.terminal}>
        <div className={styles.titleBar}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
          <span className={styles.titleText}>jairo@embedded-device:~</span>
        </div>
        <div className={styles.body}>
          {displayed.map((line, i) => (
            <div key={i} className={styles.lineGroup}>
              <div className={styles.promptLine}>
                <span className={styles.prompt}>{line.prompt}</span>
                {i === displayed.length - 1 && !line.output && (
                  <span className={`${styles.cursor} ${cursorVisible ? '' : styles.cursorHidden}`}>▌</span>
                )}
              </div>
              {line.output && (
                <div className={styles.output}>{line.output}</div>
              )}
            </div>
          ))}
          {displayed.length === LINES.length && displayed[LINES.length - 1]?.output && (
            <div className={styles.promptLine}>
              <span className={styles.prompt}>$ </span>
              <span className={`${styles.cursor} ${cursorVisible ? '' : styles.cursorHidden}`}>▌</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
