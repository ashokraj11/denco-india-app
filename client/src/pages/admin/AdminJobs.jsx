import AdminCrudTable from '../../components/admin/AdminCrudTable';

const EMPLOYMENT_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' }
];

// Non-empty string values on purpose -- AdminCrudTable's generic select
// input falls back to '' for falsy form values, which would make a real
// "0" / inactive selection render as a blank "Select…" placeholder instead.
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active (visible on Careers page)' },
  { value: 'inactive', label: 'Inactive (hidden)' }
];

export default function AdminJobs() {
  return (
    <AdminCrudTable
      title="Job Postings"
      listPath="/admin/jobs"
      adminBasePath="/admin/jobs"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'location', label: 'Location' },
        { key: 'employmentType', label: 'Type' },
        { key: 'is_active', label: 'Status', render: (row) => (row.is_active === 'inactive' ? 'Inactive' : 'Active') },
        { key: 'display_order', label: 'Order' }
      ]}
      fields={[
        { name: 'title', label: 'Job Title', type: 'text', required: true },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'employment_type', label: 'Employment Type', type: 'select', options: EMPLOYMENT_OPTIONS },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'is_active', label: 'Status', type: 'select', options: STATUS_OPTIONS },
        { name: 'display_order', label: 'Display Order', type: 'number' }
      ]}
      emptyItem={{ title: '', location: '', employment_type: 'Full-time', description: '', is_active: 'active', display_order: 0 }}
    />
  );
}
