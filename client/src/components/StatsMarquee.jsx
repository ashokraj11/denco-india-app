import { useEffect, useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
import ContentIcon from './icons/ContentIcon';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const SPEED = 42; // px per second — constant, dt-based so it never drifts or lags

export default function StatsMarquee() {
  const { data: stats } = useFetch('/stats');
  const marqueeRef = useRef(null);
  const originalRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const original = originalRef.current;
    if (!marquee || !original || !stats?.length) return undefined;

    let unitWidth = 0;
    let pos = 0;
    let clones = [];
    let rafId = null;
    let resizeTimer = null;

    function clearClones() {
      clones.forEach((c) => c.remove());
      clones = [];
    }

    function build() {
      clearClones();
      unitWidth = original.getBoundingClientRect().width;
      if (!unitWidth) return;
      const viewportWidth = marquee.parentElement.getBoundingClientRect().width;
      const copiesNeeded = Math.max(1, Math.ceil((viewportWidth * 2) / unitWidth));
      for (let i = 0; i < copiesNeeded; i++) {
        const clone = original.cloneNode(true);
        clone.removeAttribute('id');
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
        clones.push(clone);
      }
    }

    let lastTs = null;
    function tick(ts) {
      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      if (unitWidth > 0) {
        pos -= SPEED * dt;
        if (pos <= -unitWidth) pos += unitWidth;
        marquee.style.transform = `translateX(${pos}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function rebuildAndReset() {
      pos = 0;
      marquee.style.transform = 'translateX(0px)';
      build();
    }

    const imgs = original.querySelectorAll('img');
    let pending = imgs.length;
    if (pending === 0) {
      build();
    } else {
      imgs.forEach((img) => {
        if (img.complete) { if (--pending <= 0) build(); }
        else img.addEventListener('load', () => { if (--pending <= 0) build(); }, { once: true });
      });
      setTimeout(build, 1200);
    }

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuildAndReset, 150);
    };
    window.addEventListener('resize', onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      clearClones();
    };
  }, [stats]);

  return (
    <section className="stats-band">
      <div className="container">
        <Reveal as="div" className="stats-card">
          <div className="trust-marquee" id="trustMarquee" ref={marqueeRef}>
            <div className="trust-marquee-track" id="trustTrackOriginal" ref={originalRef}>
              {stats?.map((s) => (
                <div className="trust-chip" key={s.id}>
                  <ContentIcon name={s.icon_key} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <DecorativeLayer hostIndex={3} dark />
    </section>
  );
}
