import React, { useState, useEffect, useRef } from 'react';
import styles from './TerminalHero.module.css';

const COMMAND = '$ bitbake core-image-custom';
const OUTPUT_LINES = [
  { text: 'Loading cache: 100% |████████████████| ETA: 00:00:00', style: 'dim' },
  { text: 'Parsing recipes: 2,847 of 2,847', style: 'dim' },
  { text: 'Build Configuration:', style: 'default' },
  { text: '  MACHINE = "custom-arm64"', style: 'highlight' },
  { text: '  DISTRO  = "poky-custom"', style: 'highlight' },
  { text: 'NOTE: Tasks: 4,218 (3,912 cached)', style: 'note' },
  { text: 'NOTE: Build completed successfully.', style: 'note' },
];

const CHAR_DELAY = 35;
const LINE_DELAY = 300;
const OUTPUT_PAUSE = 400;

export default function TerminalHero() {
  const [typedCmd, setTypedCmd] = useState('');
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const animationRan = useRef(false);

  useEffect(() => {
    if (animationRan.current) return;
    animationRan.current = true;
    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function animate() {
      // Type command character by character
      for (let i = 1; i <= COMMAND.length; i++) {
        if (cancelled) return;
        setTypedCmd(COMMAND.slice(0, i));
        await sleep(CHAR_DELAY);
      }
      await sleep(OUTPUT_PAUSE);
      // Reveal output lines one by one
      for (let i = 1; i <= OUTPUT_LINES.length; i++) {
        if (cancelled) return;
        setVisibleLines(i);
        await sleep(LINE_DELAY);
      }
      if (!cancelled) setDone(true);
    }

    animate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  const cursorClass = `${styles.cursor} ${cursorVisible ? '' : styles.cursorHidden}`;

  return (
    <div className={styles.terminal}>
      <div className={styles.titleBar}>
        <span className={styles.dot} data-color="red" />
        <span className={styles.dot} data-color="yellow" />
        <span className={styles.dot} data-color="green" />
        <span className={styles.titleText}>~/yocto/build</span>
      </div>
      <div className={styles.body}>
        <div className={styles.promptLine}>
          <span className={styles.prompt}>{typedCmd}</span>
          {!done && visibleLines === 0 && (
            <span className={cursorClass}>▊</span>
          )}
        </div>
        {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={styles[`line_${line.style}`]}>
            {line.text}
          </div>
        ))}
        {done && (
          <div className={styles.promptLine}>
            <span className={styles.prompt}>$ </span>
            <span className={cursorClass}>▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
