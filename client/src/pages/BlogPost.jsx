import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { CalendarIcon } from '../components/icons/UiIcons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SITE_URL = 'https://dencoindia.com/';

function upsertMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
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

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(`/blog-posts/${slug}`);
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!post) return;
    document.title = `${post.metaTitle || post.title} | DENCO INDIA`;
    upsertMeta('description', post.metaDescription || post.excerpt);
    const canonicalUrl = `${SITE_URL}blog/${post.slug}`;
    upsertCanonical(canonicalUrl);

    const logoSrc = resolveImageUrl(settings.logoUrl);
    upsertJsonLd('seo-blogposting-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt || undefined,
      image: resolveImageUrl(post.coverImageUrl) || undefined,
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || post.publishedAt || undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      author: { '@type': 'Organization', name: settings.siteName || 'DENCO INDIA', url: SITE_URL },
      publisher: {
        '@type': 'Organization',
        name: settings.siteName || 'DENCO INDIA',
        logo: logoSrc ? { '@type': 'ImageObject', url: logoSrc } : undefined
      }
    });

    upsertJsonLd('seo-blog-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl }
      ]
    });

    // Reset the canonical tag and remove this page's structured data on
    // unmount -- otherwise navigating to a page that doesn't set its own
    // canonical/JSON-LD (Home, Careers, etc.) would incorrectly keep
    // pointing at this post.
    return () => {
      upsertCanonical(SITE_URL);
      removeJsonLd('seo-blogposting-jsonld');
      removeJsonLd('seo-blog-breadcrumb-jsonld');
    };
  }, [post, settings.siteName, settings.logoUrl]);

  return (
    <>
      <Navbar />
      <main className="blog-post-page">
        <div className="container">
          {loading && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>Loading…</p>}
          {error && (
            <div style={{ textAlign: 'center', color: 'var(--mute)' }}>
              <p>This post isn't available right now.</p>
              <Link to="/blog" className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>Back to Blog</Link>
            </div>
          )}
          {post && (
            <>
              <span className="blog-post-category">{post.categoryName}</span>
              <h1>{post.title}</h1>
              <span className="blog-post-date"><CalendarIcon width={15} height={15} /> {formatDate(post.publishedAt)}</span>
              {post.coverImageUrl && (
                <img className="blog-post-cover" src={resolveImageUrl(post.coverImageUrl)} alt="" />
              )}
              <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
              <Link to="/blog" className="btn btn-ghost btn-sm" style={{ marginTop: '2rem' }}>Back to Blog</Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
