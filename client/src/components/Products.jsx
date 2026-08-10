import { useFetch } from '../hooks/useFetch';
import ContentIcon from './icons/ContentIcon';
import { ArrowRightIcon, ChevronUpIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const ICON_BG = { crown: 'var(--accent)', cadcam: 'var(--navy)', zirconia: 'var(--accent)', implant: 'var(--navy)', denture: 'var(--accent)', scan: 'var(--navy)' };

export default function Products() {
  const { data: categories, loading } = useFetch('/products');

  return (
    <section className="products" id="products">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Our Product Range</span>
          <h2>Browse by Category</h2>
          <p>Every restoration we manufacture falls under one of four categories. Select a category to jump straight to its product list.</p>
        </Reveal>

        {loading && <p>Loading products…</p>}

        <div className="cat-grid">
          {categories?.map((cat, i) => (
            <Reveal as="a" href={`#${cat.slug}`} className="cat-card" key={cat.id} delay={i + 1}>
              <span className="cat-ico" style={{ background: ICON_BG[cat.icon_key] }}>
                <ContentIcon name={cat.icon_key} />
              </span>
              <h4>{cat.name}</h4>
              <span className="cat-count">{cat.products.length} Products</span>
              <span className="cat-link">View Products <ArrowRightIcon strokeWidth="2.4" /></span>
            </Reveal>
          ))}
        </div>

        {categories?.map((cat) => (
          <Reveal as="div" className="cat-section" id={cat.slug} key={cat.id}>
            <div className="cat-section-head">
              <h3>
                <span className="cat-ico" style={{ background: ICON_BG[cat.icon_key] }}>
                  <ContentIcon name={cat.icon_key} />
                </span>
                {cat.name}
              </h3>
              <a href="#products" className="back-to-cats">Back to Categories <ChevronUpIcon /></a>
            </div>
            <div className="product-grid">
              {cat.products.map((p, i) => (
                <Reveal as="div" className="product-card" key={p.id} delay={(i % 3) + 1}>
                  <div className="product-thumb"><span className="product-dot"></span><img src={p.image_url} alt={p.name} loading="lazy" /></div>
                  <div className="product-body">
                    <div className="product-name"><h5>{p.name}</h5></div>
                    <div className="product-desc"><p>{p.description}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <DecorativeLayer hostIndex={2} />
    </section>
  );
}
