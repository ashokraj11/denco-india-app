import AdminCrudTable from '../../components/admin/AdminCrudTable';

export default function AdminCertifications() {
  return (
    <AdminCrudTable
      title="Certifications"
      listPath="/certifications"
      adminBasePath="/admin/certifications"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'text', required: true },
        { name: 'image_url', label: 'Certificate Image', type: 'image', required: true },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ title: '', description: '', image_url: '', display_order: 0 }}
    />
  );
}
