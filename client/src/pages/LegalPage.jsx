import { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LegalPage({ slug }) {
  const { data: page, loading, error } = useFetch(`/legal-pages/${slug}`);

  useEffect(() => {
    document.title = `${page?.title || 'Legal'} | DENCO INDIA`;
  }, [page?.title]);

  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="container">
          {loading && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>Loading…</p>}
          {error && <p style={{ textAlign: 'center', color: 'var(--mute)' }}>This page isn't available right now.</p>}
          {page && (
            <>
              <h1>{page.title}</h1>
              <p className="legal-page-updated">Last updated {new Date(page.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="legal-page-content">{page.content}</div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
