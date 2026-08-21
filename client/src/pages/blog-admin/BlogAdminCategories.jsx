import AdminCrudTable from '../../components/admin/AdminCrudTable';
import { api } from '../../api/blogAdminClient';

export default function BlogAdminCategories() {
  return (
    <AdminCrudTable
      title="Blog Categories"
      listPath="/blog-admin/categories"
      adminBasePath="/blog-admin/categories"
      api={api}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true, deriveFrom: 'name' },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ name: '', slug: '', display_order: 0 }}
    />
  );
}
