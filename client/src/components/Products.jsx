import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import ContentIcon from './icons/ContentIcon';
import { ArrowRightIcon, ChevronUpIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { getIconBg } from '../utils/iconBg';

const INITIAL_VISIBLE = 6;

export default function Products() {
  const { data: categories, loading } = useFetch('/products');
  const [expandedCats, setExpandedCats] = useState({});

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
              <span className="cat-ico" style={{ background: getIconBg(cat.icon_key) }}>
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
                <span className="cat-ico" style={{ background: getIconBg(cat.icon_key) }}>
                  <ContentIcon name={cat.icon_key} />
                </span>
                {cat.name}
              </h3>
              <a href="#products" className="back-to-cats">Back to Categories <ChevronUpIcon /></a>
            </div>
            <div className="product-grid">
              {(expandedCats[cat.id] ? cat.products : cat.products.slice(0, INITIAL_VISIBLE)).map((p, i) => (
                <Reveal as="div" className="product-card" key={p.id} delay={(i % 3) + 1}>
                  <div className="product-thumb"><span className="product-dot"></span><img src={resolveImageUrl(p.image_url)} alt={p.name} loading="lazy" /></div>
                  <div className="product-body">
                    <div className="product-name"><h5>{p.name}</h5></div>
                    <div className="product-desc"><p>{p.description}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
            {!expandedCats[cat.id] && cat.products.length > INITIAL_VISIBLE && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setExpandedCats((s) => ({ ...s, [cat.id]: true }))}
                >
                  Show More ({cat.products.length - INITIAL_VISIBLE} more)
                </button>
              </div>
            )}
          </Reveal>
        ))}
      </div>
      <DecorativeLayer hostIndex={2} />
    </section>
  );
}
