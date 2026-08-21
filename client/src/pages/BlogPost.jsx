import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { CalendarIcon } from '../components/icons/UiIcons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(`/blog-posts/${slug}`);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.metaTitle || post.title} | DENCO INDIA`;
    upsertMeta('description', post.metaDescription || post.excerpt);
  }, [post]);

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
