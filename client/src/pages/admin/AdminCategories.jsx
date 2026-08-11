import AdminCrudTable from '../../components/admin/AdminCrudTable';
import { CONTENT_ICON_OPTIONS } from '../../constants/contentIcons';

export default function AdminCategories() {
  return (
    <AdminCrudTable
      title="Product Categories"
      listPath="/admin/categories"
      adminBasePath="/admin/categories"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'icon_key', label: 'Icon' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'slug', label: 'Slug (used as the page anchor, e.g. cat-fixed)', type: 'text', required: true, deriveFrom: 'name' },
        { name: 'icon_key', label: 'Icon', type: 'select', required: true, options: CONTENT_ICON_OPTIONS },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ name: '', slug: '', icon_key: '', display_order: 0 }}
    />
  );
}
