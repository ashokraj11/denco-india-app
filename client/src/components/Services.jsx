import { useFetch } from '../hooks/useFetch';
import ContentIcon from './icons/ContentIcon';
import { ArrowRightIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';
import { getIconBg } from '../utils/iconBg';

export default function Services() {
  const { data: services, loading } = useFetch('/services');

  return (
    <section className="areas" id="services">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What We Do</span>
          <h2>Our Dental Laboratory Services</h2>
          <p>Six core restoration categories, each produced on our digital CAD/CAM workflow and backed by strict quality inspection at every stage.</p>
        </Reveal>
        <div className="area-grid">
          {loading && <p>Loading services…</p>}
          {services?.map((svc, i) => (
            <Reveal as="div" className="area-card" key={svc.id} delay={(i % 3) + 1}>
              <span className="area-ico" style={{ background: getIconBg(svc.icon_key) }}>
                <ContentIcon name={svc.icon_key} />
              </span>
              <h4>{svc.title}</h4>
              <a href={`#${svc.category_slug}`} className="area-link">Learn More <ArrowRightIcon strokeWidth="2.4" /></a>
            </Reveal>
          ))}
        </div>
      </div>
      <DecorativeLayer hostIndex={1} />
    </section>
  );
}
