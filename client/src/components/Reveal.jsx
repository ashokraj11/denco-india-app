import { useReveal } from '../hooks/useReveal';

// Drop-in wrapper reproducing the site's [data-reveal] fade-up-on-scroll
// pattern. `delay` maps to the site's [data-reveal-delay="1..5"] CSS rules.
export default function Reveal({ as: Tag = 'div', delay, className = '', children, ...rest }) {
  const [ref, inView] = useReveal();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-reveal-delay={delay || undefined}
      className={inView ? `${className} in`.trim() : className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
