import AdminCrudTable from '../../components/admin/AdminCrudTable';

const ICON_OPTIONS = [
  { value: 'crown', label: 'Crown' },
  { value: 'cadcam', label: 'CAD/CAM' },
  { value: 'zirconia', label: 'Zirconia' },
  { value: 'implant', label: 'Implant' },
  { value: 'denture', label: 'Denture' },
  { value: 'scan', label: 'Scan' }
];

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
        { name: 'slug', label: 'Slug (used as the page anchor, e.g. cat-fixed)', type: 'text', required: true },
        { name: 'icon_key', label: 'Icon', type: 'select', required: true, options: ICON_OPTIONS },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ name: '', slug: '', icon_key: '', display_order: 0 }}
    />
  );
}
