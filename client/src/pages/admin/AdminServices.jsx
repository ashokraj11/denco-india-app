import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const ICON_OPTIONS = [
  { value: 'crown', label: 'Crown' },
  { value: 'cadcam', label: 'CAD/CAM' },
  { value: 'zirconia', label: 'Zirconia' },
  { value: 'implant', label: 'Implant' },
  { value: 'denture', label: 'Denture' },
  { value: 'scan', label: 'Scan' }
];

export default function AdminServices() {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    api.get('/admin/categories')
      .then((cats) => setCategoryOptions(cats.map((c) => ({ value: c.slug, label: c.name }))))
      .catch(() => {});
  }, []);

  return (
    <AdminCrudTable
      title="Services (the “Our Services” grid)"
      listPath="/services"
      adminBasePath="/admin/services"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'icon_key', label: 'Icon' },
        { key: 'category_slug', label: 'Links to Category' },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'icon_key', label: 'Icon', type: 'select', required: true, options: ICON_OPTIONS },
        { name: 'category_slug', label: 'Links to Category', type: 'select', required: true, options: categoryOptions },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ title: '', icon_key: '', category_slug: '', display_order: 0 }}
    />
  );
}
