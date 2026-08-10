import { useEffect } from 'react';

const FRAME_COUNT = 96;
const SCROLL_DISTANCE = 100; // reaches the last frame within a short scroll
const framePath = (i) => `/hero-image-animation/frame-${String(i).padStart(4, '0')}.jpg`;

// Port of the original scroll-scrubbed canvas hero animation: preloads all
// 96 frames, then repaints the canvas as the user scrolls, crossfading
// between the two nearest frames for a smooth (not stepped) scrub.
export function useHeroSequence(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return undefined;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const images = new Array(FRAME_COUNT);
    let currentFrame = 0;

    function drawImageFitted(img, cw, ch) {
      const cRatio = cw / ch;
      const iRatio = img.naturalWidth / img.naturalHeight;

      if (window.innerWidth <= 900) {
        let sw, sh, sx, sy;
        if (iRatio > cRatio) {
          sh = img.naturalHeight; sw = sh * cRatio; sy = 0; sx = (img.naturalWidth - sw) / 2;
        } else {
          sw = img.naturalWidth; sh = sw / cRatio; sx = 0; sy = 0;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      } else {
        let dw, dh, dx, dy;
        if (iRatio > cRatio) {
          dw = cw; dh = cw / iRatio; dx = 0; dy = 0;
        } else {
          dh = ch; dw = ch * iRatio; dy = 0; dx = (cw - dw) / 2;
        }
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
      }
    }

    function drawFrame(framePos) {
      const baseIndex = Math.floor(framePos);
      const frac = framePos - baseIndex;
      const img1 = images[baseIndex - 1];
      if (!img1 || !img1.complete || !img1.naturalWidth) return;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch) return;
      const pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      drawImageFitted(img1, cw, ch);

      if (frac > 0.001) {
        const img2 = images[Math.min(FRAME_COUNT, baseIndex + 1) - 1];
        if (img2 && img2.complete && img2.naturalWidth) {
          ctx.globalAlpha = frac;
          drawImageFitted(img2, cw, ch);
          ctx.globalAlpha = 1;
        }
      }
      currentFrame = framePos;
    }

    function frameForProgress(p) {
      return Math.min(FRAME_COUNT, Math.max(1, p * (FRAME_COUNT - 1) + 1));
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.min(1, Math.max(0, window.scrollY / SCROLL_DISTANCE));
        const framePos = frameForProgress(progress);
        if (framePos !== currentFrame) drawFrame(framePos);
        ticking = false;
      });
    }

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(i);
      if (i === 1) img.onload = () => drawFrame(1);
      images[i - 1] = img;
    }

    const onResize = () => drawFrame(currentFrame || 1);
    window.addEventListener('resize', onResize);

    if (reduceMotion) {
      return () => window.removeEventListener('resize', onResize);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [canvasRef]);
}
