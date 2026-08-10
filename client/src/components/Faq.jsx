import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { ChevronDownIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const TABS = [
  { key: 'all', label: 'All Questions' },
  { key: 'ordering', label: 'Ordering & Turnaround' },
  { key: 'digital', label: 'Digital Workflow' },
  { key: 'quality', label: 'Quality & Certification' },
  { key: 'logistics', label: 'Logistics & Service Area' },
  { key: 'billing', label: 'Billing & Support' }
];

const CATEGORY_LABEL = {
  ordering: 'Ordering & Turnaround',
  digital: 'Digital Workflow',
  quality: 'Quality & Certification',
  logistics: 'Logistics & Service Area',
  billing: 'Billing & Support'
};

export default function Faq() {
  const { data: faqs, loading } = useFetch('/faqs');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const visible = faqs?.filter((f) => filter === 'all' || f.category === filter) || [];

  return (
    <section className="faq" id="faq">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Frequently Asked Questions</span>
          <h2>Answers to Common Questions</h2>
          <p>Everything dental professionals ask us about ordering, our digital workflow, quality assurance and logistics. Can't find what you're looking for? Reach out via the contact form below.</p>
        </Reveal>

        <Reveal as="div" className="faq-wrap">
          <div className="faq-tabs" role="tablist" aria-label="Filter FAQs by category">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`faq-tab${filter === tab.key ? ' active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="faq-list">
            {loading && <p>Loading FAQs…</p>}
            {visible.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div className={`faq-item${isOpen ? ' open' : ''}`} data-category={item.category} key={item.id}>
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span>
                      <span className="faq-cat-tag">{CATEGORY_LABEL[item.category] || item.category}</span><br />
                      {item.question}
                    </span>
                    <span className="faq-icon"><ChevronDownIcon /></span>
                  </button>
                  <div className="faq-answer" style={{ maxHeight: isOpen ? '999px' : undefined }}>
                    <div className="faq-answer-inner" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="faq-more">Still have questions? <a href="#contact">Get in touch with our team</a> and we'll respond within one business day.</p>
        </Reveal>
      </div>
      <DecorativeLayer hostIndex={9} />
    </section>
  );
}
