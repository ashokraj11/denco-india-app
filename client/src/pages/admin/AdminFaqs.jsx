import AdminCrudTable from '../../components/admin/AdminCrudTable';

const CATEGORY_OPTIONS = [
  { value: 'ordering', label: 'Ordering & Turnaround' },
  { value: 'digital', label: 'Digital Workflow' },
  { value: 'quality', label: 'Quality & Certification' },
  { value: 'logistics', label: 'Logistics & Service Area' },
  { value: 'billing', label: 'Billing & Support' }
];

export default function AdminFaqs() {
  return (
    <AdminCrudTable
      title="FAQs"
      listPath="/faqs"
      adminBasePath="/admin/faqs"
      columns={[
        { key: 'category', label: 'Category' },
        { key: 'question', label: 'Question' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORY_OPTIONS },
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer_html', label: 'Answer', type: 'textarea', required: true, hint: 'Basic HTML is supported, e.g. <p>...</p> or <ul><li>...</li></ul>.' },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ category: '', question: '', answer_html: '', display_order: 0 }}
    />
  );
}
