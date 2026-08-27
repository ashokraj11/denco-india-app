import AdminCrudTable from '../../components/admin/AdminCrudTable';

export default function AdminHeroHeadlines() {
  return (
    <AdminCrudTable
      title="Hero Headlines"
      description="The big rotating headline on the homepage hero section. Each entry auto-rotates in Display Order every few seconds -- add just one to make it static."
      listPath="/hero-headlines"
      adminBasePath="/admin/hero-headlines"
      columns={[
        { key: 'line1', label: 'Line 1' },
        { key: 'line2', label: 'Line 2' },
        { key: 'accent', label: 'Accent Phrase' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'line1', label: 'Line 1', type: 'text', required: true, hint: 'First line of the headline, e.g. "Trusted Dental Lab Partner,"' },
        { name: 'line2', label: 'Line 2', type: 'text', required: true, hint: 'Leads into the accent phrase, e.g. "Delivering"' },
        { name: 'accent', label: 'Accent Phrase', type: 'text', required: true, hint: 'Shown in orange at the end, e.g. "On Time, Every Time."' },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ line1: '', line2: '', accent: '', display_order: 0 }}
    />
  );
}
