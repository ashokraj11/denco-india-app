import { useFetch } from '../hooks/useFetch';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';
import { resolveImageUrl } from '../utils/resolveImageUrl';

export default function Testimonials() {
  const { settings } = useSiteSettings();
  const { data: items, loading } = useFetch('/testimonials');

  if (!settings.testimonialsVisible) return null;
  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What Our Partners Say</span>
          <h2>Trusted by Dentists Across Tamil Nadu</h2>
        </Reveal>

        {loading && <p>Loading testimonials…</p>}

        <Reveal as="div" className="testimonials-grid">
          {items?.map((t) => (
            <div className="testimonial-card" key={t.id}>
              {t.mediaUrl && (
                <div className="testimonial-media">
                  {t.mediaType === 'video' ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video src={resolveImageUrl(t.mediaUrl)} muted playsInline controls preload="metadata" />
                  ) : (
                    <img src={resolveImageUrl(t.mediaUrl)} alt={t.name} loading="lazy" />
                  )}
                </div>
              )}
              <div className="testimonial-body">
                {t.quote && <p className="testimonial-quote">“{t.quote}”</p>}
                <div className="testimonial-name">{t.name}</div>
                {t.role && <div className="testimonial-role">{t.role}</div>}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
      <DecorativeLayer hostIndex={11} />
    </section>
  );
}
