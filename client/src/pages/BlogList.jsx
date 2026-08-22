import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { CalendarIcon, ArrowRightIcon } from '../components/icons/UiIcons';
import Reveal from '../components/Reveal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PAGE_SIZE = 9;
const SITE_URL = 'https://dencoindia.com/';
const BLOG_URL = `${SITE_URL}blog`;

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function upsertCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}

export default function BlogList() {
  const { data: posts, loading } = useFetch('/blog-posts');
  const { data: categories } = useFetch('/blog-categories');
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = 'Blog | DENCO INDIA';
    upsertCanonical(BLOG_URL);

    upsertJsonLd('seo-blog-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: BLOG_URL }
      ]
    });

    return () => {
      upsertCanonical(SITE_URL);
      removeJsonLd('seo-blog-breadcrumb-jsonld');
      removeJsonLd('seo-blog-itemlist-jsonld');
    };
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return [];
    if (!activeCategory) return posts;
    return posts.filter((p) => p.categorySlug === activeCategory);
  }, [posts, activeCategory]);

  useEffect(() => {
    if (!filtered.length) return;
    upsertJsonLd('seo-blog-itemlist-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: filtered.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BLOG_URL}/${post.slug}`,
        name: post.title
      }))
    });
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectCategory(slug) {
    setActiveCategory(slug);
    setPage(1);
  }

  return (
    <>
      <Navbar />
      <main className="blog-page">
        <div className="container">
          <Reveal as="div" className="sec-head" style={{ marginTop: 'calc(var(--nav-h, 5.5rem) + 2.5rem)' }}>
            <span className="eyebrow">Blog</span>
            <h2>Insights from DENCO INDIA</h2>
            <p>Perspectives on digital dentistry, CAD/CAM prosthetics and lab best practices from our team.</p>
          </Reveal>

          {categories?.length > 0 && (
            <div className="blog-filters">
              <button
                type="button"
                className={`blog-filter-chip${!activeCategory ? ' active' : ''}`}
                onClick={() => selectCategory(null)}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`blog-filter-chip${activeCategory === c.slug ? ' active' : ''}`}
                  onClick={() => selectCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {loading && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>Loading posts…</p>}
          {!loading && filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--mute)' }}>No posts yet — check back soon.</p>
          )}

          <Reveal as="div" className="blog-grid">
            {pageItems.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">
                {post.coverImageUrl && (
                  <div className="blog-thumb">
                    <img src={resolveImageUrl(post.coverImageUrl)} alt="" />
                  </div>
                )}
                <div className="blog-body">
                  <span className="blog-card-category">{post.categoryName}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span className="blog-card-date"><CalendarIcon width={14} height={14} /> {formatDate(post.publishedAt)}</span>
                  <span className="blog-card-link">Read More <ArrowRightIcon /></span>
                </div>
              </Link>
            ))}
          </Reveal>

          {totalPages > 1 && (
            <div className="blog-pagination">
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
