// Seeds the database with DENCO INDIA's real content (ported from the
// original static index.html) so the app has correct data out of the box.
// Safe to run any number of times: each table is only populated the first
// time it's empty, then skipped on every later run — so edits made through
// the admin panel are never overwritten by a later `npm run db:seed`.
// Usage: npm run db:seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const services = [
  { title: 'Crown & Bridge', icon_key: 'crown', category_slug: 'cat-fixed' },
  { title: 'CAD/CAM Digital Dentistry', icon_key: 'cadcam', category_slug: 'cat-digital' },
  { title: 'Zirconia Restorations', icon_key: 'zirconia', category_slug: 'cat-fixed' },
  { title: 'Implant Prosthetics', icon_key: 'implant', category_slug: 'cat-implant' },
  { title: 'Complete & Partial Dentures', icon_key: 'denture', category_slug: 'cat-removable' },
  { title: 'Digital Scanning & 3D Models', icon_key: 'scan', category_slug: 'cat-digital' }
];

const productCategories = [
  {
    slug: 'cat-fixed', name: 'Fixed Restorations', icon_key: 'crown',
    products: [
      { name: 'Crown & Bridge Restorations', image_url: 'https://placehold.co/400x300/0F5B3F/FEF0E6?text=Crown+%26+Bridge&font=raleway', description: 'Precision-fit fixed restorations produced on our digital CAD/CAM workflow for accurate marginal fit and function.' },
      { name: 'Zirconia Restorations', image_url: 'https://placehold.co/400x300/147A52/FEF0E6?text=Zirconia&font=raleway', description: 'High-strength, biocompatible zirconia crowns and bridges built for durability and a natural aesthetic finish.' },
      { name: 'PFM Crowns', image_url: 'https://placehold.co/400x300/0B3327/FEF0E6?text=PFM+Crowns&font=raleway', description: 'Porcelain-fused-to-metal crowns offering a dependable balance of strength and aesthetics.' },
      { name: 'E-Max Restorations', image_url: 'https://placehold.co/400x300/0F5B3F/FEF0E6?text=E-Max&font=raleway', description: 'Lithium-disilicate restorations for cases that call for superior translucency and aesthetic quality.' }
    ]
  },
  {
    slug: 'cat-removable', name: 'Removable Prosthetics', icon_key: 'denture',
    products: [
      { name: 'Complete Dentures', image_url: 'https://placehold.co/400x300/147A52/FEF0E6?text=Complete+Dentures&font=raleway', description: 'Full-arch removable dentures crafted for comfort, fit and a natural appearance.' },
      { name: 'Partial Dentures', image_url: 'https://placehold.co/400x300/0B3327/FEF0E6?text=Partial+Dentures&font=raleway', description: 'Custom partial dentures designed to restore function while preserving remaining natural teeth.' }
    ]
  },
  {
    slug: 'cat-implant', name: 'Implant & Custom Solutions', icon_key: 'implant',
    products: [
      { name: 'Implant Prosthetics', image_url: 'https://placehold.co/400x300/0F5B3F/FEF0E6?text=Implant+Prosthetics&font=raleway', description: 'Implant-supported restorations engineered for accurate fit, function and long-term durability.' },
      { name: 'Custom Dental Prosthetic Solutions', image_url: 'https://placehold.co/400x300/147A52/FEF0E6?text=Custom+Solutions&font=raleway', description: 'Bespoke prosthetic solutions tailored to complex or non-standard clinical cases.' }
    ]
  },
  {
    slug: 'cat-digital', name: 'Digital Dentistry & CAD/CAM', icon_key: 'cadcam',
    products: [
      { name: 'CAD/CAM Digital Dentistry', image_url: 'https://placehold.co/400x300/0B3327/FEF0E6?text=CAD%2FCAM&font=raleway', description: 'Full digital design-to-manufacture workflow for consistent accuracy across every case.' },
      { name: 'Digital Dental Scanning', image_url: 'https://placehold.co/400x300/0F5B3F/FEF0E6?text=Digital+Scanning&font=raleway', description: 'High-precision intraoral and model scanning that removes the need for physical impressions.' },
      { name: '3D Printed Dental Models', image_url: 'https://placehold.co/400x300/147A52/FEF0E6?text=3D+Printed+Models&font=raleway', description: 'Industrial 3D-printed models and appliances produced for accuracy and fast turnaround.' }
    ]
  }
];

const certifications = [
  { title: 'ISO 13485:2016', description: 'Medical Devices Quality Management', image_url: 'https://placehold.co/1000x750/0F5B3F/FEF0E6?text=ISO+13485%3A2016&font=raleway' },
  { title: 'ISO 9001:2015', description: 'Quality Management Systems', image_url: 'https://placehold.co/1000x750/147A52/FEF0E6?text=ISO+9001%3A2015&font=raleway' },
  { title: 'ISO 6872:2015', description: 'Dentistry — Ceramic Materials', image_url: 'https://placehold.co/1000x750/0B3327/FEF0E6?text=ISO+6872%3A2015&font=raleway' }
];

// Each area is { name, district } — district is a slug matching the `districts`
// seed above. Mapped from real Tamil Nadu district boundaries; one entry
// (marked below) is a lower-confidence guess rather than a certain mapping.
const offices = [
  { name: 'Mr. Ananthan S', role: 'Area Manager', phone: '+91 88701 97856', areas: [
    { name: 'Aranthangi', district: 'pudukkottai' },
    { name: 'Karaikudi', district: 'sivaganga' },
    { name: 'Kumbakonam', district: 'thanjavur' },
    { name: 'Palani', district: 'dindigul' },
    { name: 'Pattukkottai', district: 'thanjavur' },
    { name: 'Perambalur', district: 'perambalur' },
    { name: 'Peravurani', district: 'thanjavur' },
    { name: 'Pollachi', district: 'coimbatore' },
    { name: 'Ponnamaravathi', district: 'pudukkottai' },
    { name: 'Pudukkottai', district: 'pudukkottai' },
    { name: 'Thanjavur', district: 'thanjavur' },
    { name: 'Udumalaipet', district: 'tiruppur' }
  ] },
  { name: 'Mr. Sakthivelmurugan M', role: 'Area Manager', phone: '+91 94441 76257', areas: [
    { name: 'Cuddalore', district: 'cuddalore' },
    { name: 'Dharmapuri', district: 'dharmapuri' },
    { name: 'Karur', district: 'karur' },
    { name: 'Krishnagiri', district: 'krishnagiri' },
    { name: 'Mechery', district: 'salem' },
    { name: 'Salem', district: 'salem' },
    { name: 'Villupuram', district: 'viluppuram' }
  ] },
  { name: 'Mr. Rajasekar G', role: 'Area Manager', phone: '+91 97917 11182', areas: [
    { name: 'Kancheepuram', district: 'kancheepuram' },
    { name: 'Karaikal', district: 'karaikal' },
    { name: 'Nagapattinam (Nagai)', district: 'nagapattinam' },
    { name: 'Nagoor', district: 'nagapattinam' },
    { name: 'Namakkal', district: 'namakkal' },
    { name: 'Ramanathapuram (Ramnad)', district: 'ramanathapuram' },
    { name: 'Thiruvarur', district: 'tiruvarur' },
    { name: 'Vellore', district: 'vellore' }
  ] },
  { name: 'Mr. Manikandan', role: 'Area Manager', phone: '+91 97907 75744', areas: [
    { name: 'Ambur', district: 'tirupathur' },
    { name: 'Devakottai', district: 'sivaganga' },
    { name: 'Kodaikanal', district: 'dindigul' },
    { name: 'Mannargudi', district: 'tiruvarur' },
    { name: 'Paramakudi', district: 'ramanathapuram' },
    { name: 'Sivagangai', district: 'sivaganga' },
    { name: 'Thiruppathur', district: 'sivaganga' },
    { name: 'Thiruthuraipoondi', district: 'tiruvarur' },
    { name: 'Vaniyambadi', district: 'tirupathur' },
    { name: 'Vedaranyam', district: 'nagapattinam' }
  ] },
  { name: 'Mr. Udayachandran U', role: 'Area Manager', phone: '+91 85249 60006', areas: [
    { name: 'Bodi', district: 'theni' },
    { name: 'Chinnamanur', district: 'theni' },
    { name: 'Cumbum', district: 'theni' },
    { name: 'Jayankondam', district: 'ariyalur' },
    { name: 'Melur', district: 'madurai' },
    { name: 'Sivakasi', district: 'virudhunagar' },
    { name: 'Srivilliputhur', district: 'virudhunagar' },
    { name: 'Theni', district: 'theni' }
  ] },
  { name: 'Mr. Nagarajan G', role: 'Area Manager', phone: '+91 94431 81239', areas: [
    { name: 'Bhuvanagiri', district: 'cuddalore' },
    { name: 'Chidambaram', district: 'cuddalore' },
    { name: 'Kattumannarkoil', district: 'cuddalore' },
    { name: 'Nellikuppam', district: 'cuddalore' },
    { name: 'Panruti', district: 'cuddalore' },
    { name: 'Pennadam', district: 'cuddalore' },
    { name: 'Thittakudi', district: 'cuddalore' },
    { name: 'Thozhdur', district: 'cuddalore' },
    { name: 'Ulundurpet', district: 'kallakurichi' },
    { name: 'Virudhachalam', district: 'cuddalore' }
  ] },
  { name: 'Mr. Dharani K', role: 'Area Manager', phone: '+91 80722 01284', areas: [
    { name: 'Ariyalur', district: 'ariyalur' },
    { name: 'Chengalpattu', district: 'chengalpattu' },
    { name: 'Dhalavaipuram', district: 'virudhunagar' },
    { name: 'Kallakurichi', district: 'kallakurichi' },
    { name: 'Maduranthagam', district: 'chengalpattu' },
    { name: 'Mayiladuthurai (Mayavaram)', district: 'mayiladuthurai' },
    { name: 'Rajapalayam', district: 'virudhunagar' },
    { name: 'Tenkasi', district: 'tenkasi' },
    { name: 'Thirukovilur', district: 'kallakurichi' },
    { name: 'Thiruvannamalai', district: 'tiruvannamalai' },
    { name: 'Tindivanam', district: 'viluppuram' }
  ] },
  { name: 'Mr. Karthikeyan B', role: 'Area Manager', phone: '+91 99766 06152', areas: [
    { name: 'Bhavani', district: 'erode' },
    { name: 'Chettikulam', district: 'perambalur' }, // lower-confidence guess — small locality, verify if this manager's area is wrong
    { name: 'Kumarapalayam', district: 'namakkal' },
    { name: 'Musiri', district: 'tiruchirappalli' },
    { name: 'Padalur', district: 'perambalur' },
    { name: 'Perambalur', district: 'perambalur' },
    { name: 'Thuraiyur', district: 'tiruchirappalli' },
    { name: 'Tiruppur', district: 'tiruppur' },
    { name: 'Vikravandi', district: 'viluppuram' }
  ] },
  { name: 'Denco India Head Office', role: 'Head Office', phone: '+91 97917 11182', isHeadOffice: true, areas: [
    { name: 'Kurinjipadi', district: 'cuddalore' },
    { name: 'Kullanchavadi', district: 'cuddalore' },
    { name: 'Neyveli Mandarakuppam', district: 'cuddalore' },
    { name: 'Neyveli Township', district: 'cuddalore' },
    { name: 'Vadalur', district: 'cuddalore' }
  ] },
  { name: 'Mr. M. Jagan', role: 'Area Manager – Puducherry Region', phone: '+91 82483 69575', areas: [
    { name: 'Ariyankuppam', district: 'puducherry' },
    { name: 'Puducherry', district: 'puducherry' }
  ] }
];

const faqs = [
  { category: 'ordering', question: 'What is the standard turnaround time for a case?', answer_html: "<p>Standard turnaround for most fixed prosthetics (crowns, bridges, zirconia units) is 5–7 working days from the date the case is received and confirmed complete at our laboratory. Removable prosthetics and complex implant cases may take slightly longer depending on the number of stages involved.</p><p>Rush cases can often be accommodated — mention the requirement when booking your lab pickup or note it clearly on the case slip, and our production team will confirm feasibility with your area manager.</p>" },
  { category: 'ordering', question: 'How do I place a new case with Denco India?', answer_html: '<p>You can place a case in three ways:</p><ul><li>Hand your impressions or models to your area manager during their scheduled pickup route</li><li>Book a lab pickup directly using the form on this page or by calling your regional contact</li><li>Upload an intraoral scan directly to us if your clinic already works on a digital workflow</li></ul><p>Every case should be accompanied by a completed case slip specifying shade, material, margin design and any special instructions.</p>' },
  { category: 'digital', question: 'Do you accept digital intraoral scans, or only physical impressions?', answer_html: '<p>We accept both. Our CAD/CAM digital dentistry workflow is compatible with STL files from all major intraoral scanning systems, which can be uploaded directly for design and milling. We also continue to accept conventional PVS and alginate impressions, which are digitised in-house using our lab scanners before entering the same precision workflow.</p>' },
  { category: 'digital', question: 'What materials and restoration types can you produce digitally?', answer_html: '<p>Our digital workflow supports zirconia crowns and bridges, PMMA and wax try-ins, surgical guides, and implant-supported prosthetics, alongside 3D printed models for case planning. Each design is reviewed by our technicians before milling to confirm occlusion, contacts and margins against your instructions.</p>' },
  { category: 'quality', question: 'What quality checks does every case go through?', answer_html: '<p>Every restoration passes through multiple inspection checkpoints — model accuracy, margin fit, occlusal contacts, shade matching and surface finish — before it leaves our laboratory. Our processes are benchmarked against globally recognised quality standards, and our certifications are listed in the Certifications section above.</p>' },
  { category: 'quality', question: "What happens if a restoration doesn't fit or needs a remake?", answer_html: '<p>If a fit issue arises, contact your area manager or our head office with the case details as soon as possible. Remakes arising from a laboratory-side error are produced free of charge. We ask that adjustments or remake requests be raised within a reasonable window of delivery so our technicians can review the original model against your feedback.</p>' },
  { category: 'logistics', question: 'Which areas do you currently provide lab pickup and delivery to?', answer_html: '<p>We serve dental professionals across a wide network of towns and cities in Tamil Nadu and Puducherry, each managed by a dedicated area manager. See the full list of towns and their respective contact numbers in the Service Network section above, or use the contact form to ask about a location not listed.</p>' },
  { category: 'logistics', question: 'How are impressions and finished cases transported safely?', answer_html: '<p>All impressions and models are disinfected on receipt and transported in secure, cushioned cases by our area managers on scheduled pickup routes. Finished restorations are individually packed and quality-checked again before dispatch back to your clinic, so they arrive ready to fit.</p>' },
  { category: 'billing', question: 'How do I get a price quote for a case?', answer_html: '<p>Pricing depends on the restoration type, material and case complexity. Select "Request a Case Quote" in the contact form below, or speak to your area manager directly, and we\'ll share a detailed quote before starting work on the case.</p>' },
  { category: 'billing', question: "I'm a new clinic — how do I set up an account with Denco India?", answer_html: '<p>Select "Partnership / New Account" in the contact form below, or call our head office directly. A member of our team — or your nearest area manager — will get in touch to walk you through onboarding, case slips and pickup scheduling for your clinic.</p>' }
];

const stats = [
  { icon_key: 'check-badge', label: '100% Trustable' },
  { icon_key: 'star', label: 'Premium Quality' },
  { icon_key: 'sparkle-star', label: 'Best Choice' },
  { icon_key: 'shield-check', label: 'ISO 9001 Certified' },
  { icon_key: 'clock', label: 'Fast Turnaround' },
  { icon_key: 'precision', label: 'Precision Guaranteed' },
  { icon_key: 'users', label: '500+ Happy Clinics' },
  { icon_key: 'award', label: 'Award-Winning Lab' }
];

const galleryItems = [
  { title: 'CAD/CAM Design Studio', media_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Zirconia Milling Unit', media_url: 'https://images.unsplash.com/photo-1581093458791-9d2b11e94a9d?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Digital Scanning Station', media_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Model Trimming & Finishing', media_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Quality Inspection Bench', media_url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Technician Workstation', media_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Packaging & Dispatch', media_url: 'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1400&auto=format&fit=crop' },
  { title: 'Reception & Consultation Area', media_url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1400&auto=format&fit=crop' }
];

// The 40 fixed map points (38 Tamil Nadu districts + Puducherry + Karaikal).
// Coverage (live/soon) is NOT stored here — it's computed from office_areas.
const districts = [
  { name: 'Ariyalur', slug: 'ariyalur', left: 67.6, top: 45.4 },
  { name: 'Chengalpattu', slug: 'chengalpattu', left: 87.8, top: 19.3 },
  { name: 'Chennai', slug: 'chennai', left: 93.8, top: 12.6 },
  { name: 'Coimbatore', slug: 'coimbatore', left: 20.3, top: 47.4 },
  { name: 'Cuddalore', slug: 'cuddalore', left: 82.6, top: 35.1 },
  { name: 'Dharmapuri', slug: 'dharmapuri', left: 46.9, top: 28.7 },
  { name: 'Dindigul', slug: 'dindigul', left: 42.2, top: 58.3 },
  { name: 'Erode', slug: 'erode', left: 37.3, top: 42.0 },
  { name: 'Kallakurichi', slug: 'kallakurichi', left: 65.1, top: 35.3 },
  { name: 'Kancheepuram', slug: 'kancheepuram', left: 81.5, top: 16.7 },
  { name: 'Kanyakumari', slug: 'kanyakumari', left: 30.6, top: 95.2 },
  { name: 'Karur', slug: 'karur', left: 45.2, top: 48.4 },
  { name: 'Krishnagiri', slug: 'krishnagiri', left: 48.3, top: 22.1 },
  { name: 'Madurai', slug: 'madurai', left: 46.1, top: 65.8 },
  { name: 'Mayiladuthurai', slug: 'mayiladuthurai', left: 80.4, top: 46.0 },
  { name: 'Nagapattinam', slug: 'nagapattinam', left: 84.5, top: 51.8 },
  { name: 'Namakkal', slug: 'namakkal', left: 47.2, top: 44.0 },
  { name: 'Nilgiris', slug: 'nilgiris', left: 14.2, top: 40.8 },
  { name: 'Perambalur', slug: 'perambalur', left: 63.1, top: 43.9 },
  { name: 'Pudukkottai', slug: 'pudukkottai', left: 61.7, top: 58.2 },
  { name: 'Ramanathapuram', slug: 'ramanathapuram', left: 62.0, top: 75.2 },
  { name: 'Ranipet', slug: 'ranipet', left: 73.2, top: 15.2 },
  { name: 'Salem', slug: 'salem', left: 46.7, top: 36.6 },
  { name: 'Sivaganga', slug: 'sivaganga', left: 54.1, top: 67.1 },
  { name: 'Tenkasi', slug: 'tenkasi', left: 27.9, top: 82.1 },
  { name: 'Thanjavur', slug: 'thanjavur', left: 68.9, top: 51.3 },
  { name: 'Theni', slug: 'theni', left: 31.7, top: 64.4 },
  { name: 'Thoothukudi', slug: 'thoothukudi', left: 46.2, top: 85.5 },
  { name: 'Tiruchirappalli', slug: 'tiruchirappalli', left: 58.6, top: 51.1 },
  { name: 'Tirunelveli', slug: 'tirunelveli', left: 37.8, top: 86.3 },
  { name: 'Tirupathur', slug: 'tirupathur', left: 56.1, top: 22.5 },
  { name: 'Tiruppur', slug: 'tiruppur', left: 28.6, top: 45.9 },
  { name: 'Tiruvallur', slug: 'tiruvallur', left: 86.2, top: 11.7 },
  { name: 'Tiruvannamalai', slug: 'tiruvannamalai', left: 67.4, top: 27.0 },
  { name: 'Tiruvarur', slug: 'tiruvarur', left: 79.9, top: 51.6 },
  { name: 'Vellore', slug: 'vellore', left: 68.7, top: 15.4 },
  { name: 'Viluppuram', slug: 'viluppuram', left: 76.8, top: 31.9 },
  { name: 'Virudhunagar', slug: 'virudhunagar', left: 42.5, top: 71.5 },
  { name: 'Puducherry', slug: 'puducherry', left: 83.7, top: 31.9 },
  { name: 'Karaikal', slug: 'karaikal', left: 84.4, top: 49.1 }
];

const defaultSettings = {
  site_name: 'DENCO',
  tagline: 'INDIA',
  logo_url: null,
  meta_title: 'DENCO INDIA | Scientific Dental Laboratory & Digital Dentistry',
  meta_description: 'DENCO INDIA is a scientific dental laboratory delivering precision CAD/CAM prosthetics, zirconia restorations and digital dentistry solutions to dental professionals across Tamil Nadu.',
  contact_phone: '+91 97917 11182',
  contact_email: 'info@dencoindia.com',
  contact_address: 'Serving dental professionals across Tamil Nadu & Puducherry, India',
  whatsapp_number: '917010767919'
};

async function seedServices(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM services');
  if (count > 0) {
    console.log('Services already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await conn.query(
      'INSERT INTO services (title, icon_key, category_slug, display_order) VALUES (?, ?, ?, ?)',
      [s.title, s.icon_key, s.category_slug, i + 1]
    );
  }
  console.log(`Seeded ${services.length} services`);
}

async function seedProducts(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM product_categories');
  if (count > 0) {
    console.log('Product categories already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < productCategories.length; i++) {
    const cat = productCategories[i];
    const [result] = await conn.query(
      'INSERT INTO product_categories (slug, name, icon_key, display_order) VALUES (?, ?, ?, ?)',
      [cat.slug, cat.name, cat.icon_key, i + 1]
    );
    const categoryId = result.insertId;
    for (let j = 0; j < cat.products.length; j++) {
      const p = cat.products[j];
      await conn.query(
        'INSERT INTO products (category_id, name, image_url, description, display_order) VALUES (?, ?, ?, ?, ?)',
        [categoryId, p.name, p.image_url, p.description, j + 1]
      );
    }
  }
  console.log(`Seeded ${productCategories.length} product categories`);
}

async function seedCertifications(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM certifications');
  if (count > 0) {
    console.log('Certifications already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < certifications.length; i++) {
    const c = certifications[i];
    await conn.query(
      'INSERT INTO certifications (title, description, image_url, display_order) VALUES (?, ?, ?, ?)',
      [c.title, c.description, c.image_url, i + 1]
    );
  }
  console.log(`Seeded ${certifications.length} certifications`);
}

async function seedOffices(conn) {
  // Keyed on office_areas (not offices) specifically so this one-time-only
  // guard still lets the district/area-name data backfill onto any offices
  // that were seeded before office_areas existed; after that it's skipped
  // just like the other tables, preserving admin edits.
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM office_areas');
  if (count > 0) {
    console.log('Office service areas already seeded, skipping (admin edits are preserved)');
    return;
  }

  // districts must already be seeded (main() runs seedDistricts before this)
  // so each area's district slug can be resolved to a real district_id.
  const [districtRows] = await conn.query('SELECT id, slug FROM districts');
  const districtIdBySlug = new Map(districtRows.map((d) => [d.slug, d.id]));

  await conn.query('DELETE FROM office_locations');
  await conn.query('DELETE FROM offices'); // cascades to office_areas too
  for (let i = 0; i < offices.length; i++) {
    const o = offices[i];
    const [result] = await conn.query(
      'INSERT INTO offices (name, role, phone, is_head_office, display_order) VALUES (?, ?, ?, ?, ?)',
      [o.name, o.role, o.phone, o.isHeadOffice ? 1 : 0, i + 1]
    );
    const officeId = result.insertId;
    for (let j = 0; j < o.areas.length; j++) {
      const area = o.areas[j];
      // Legacy table, kept for backward compatibility — no longer read by the app.
      await conn.query(
        'INSERT INTO office_locations (office_id, location_name, display_order) VALUES (?, ?, ?)',
        [officeId, area.name, j + 1]
      );
      const districtId = districtIdBySlug.get(area.district);
      if (!districtId) {
        console.warn(`No district found for slug "${area.district}" (area "${area.name}", office "${o.name}") — skipped`);
        continue;
      }
      await conn.query(
        'INSERT INTO office_areas (office_id, district_id, area_name, display_order) VALUES (?, ?, ?, ?)',
        [officeId, districtId, area.name, j + 1]
      );
    }
  }
  console.log(`Seeded ${offices.length} offices with their service areas`);
}

async function seedFaqs(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM faqs');
  if (count > 0) {
    console.log('FAQs already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    await conn.query(
      'INSERT INTO faqs (category, question, answer_html, display_order) VALUES (?, ?, ?, ?)',
      [f.category, f.question, f.answer_html, i + 1]
    );
  }
  console.log(`Seeded ${faqs.length} FAQs`);
}

async function seedStats(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM stats');
  if (count > 0) {
    console.log('Stats already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    await conn.query(
      'INSERT INTO stats (icon_key, label, display_order) VALUES (?, ?, ?)',
      [s.icon_key, s.label, i + 1]
    );
  }
  console.log(`Seeded ${stats.length} stats`);
}

async function seedGallery(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM gallery_items');
  if (count > 0) {
    console.log('Gallery items already seeded, skipping (admin edits are preserved)');
    return;
  }
  for (let i = 0; i < galleryItems.length; i++) {
    const g = galleryItems[i];
    await conn.query(
      'INSERT INTO gallery_items (title, media_type, media_url, display_order) VALUES (?, ?, ?, ?)',
      [g.title, 'image', g.media_url, i + 1]
    );
  }
  console.log(`Seeded ${galleryItems.length} gallery items`);
}

async function seedDistricts(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM districts');
  if (count > 0) {
    console.log('Districts already seeded, skipping (office_areas assignments are preserved)');
    return;
  }
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    await conn.query(
      'INSERT INTO districts (name, slug, left_pct, top_pct, display_order) VALUES (?, ?, ?, ?, ?)',
      [d.name, d.slug, d.left, d.top, i + 1]
    );
  }
  console.log(`Seeded ${districts.length} districts`);
}

async function seedSettings(conn) {
  const [[{ count }]] = await conn.query('SELECT COUNT(*) AS count FROM site_settings WHERE id = 1');
  if (count > 0) {
    console.log('Site settings already exist, skipping (admin edits are preserved)');
    return;
  }
  await conn.query(
    `INSERT INTO site_settings
      (id, site_name, tagline, logo_url, meta_title, meta_description, contact_phone, contact_email, contact_address, whatsapp_number)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      defaultSettings.site_name, defaultSettings.tagline, defaultSettings.logo_url,
      defaultSettings.meta_title, defaultSettings.meta_description, defaultSettings.contact_phone,
      defaultSettings.contact_email, defaultSettings.contact_address, defaultSettings.whatsapp_number
    ]
  );
  console.log('Seeded default site settings');
}

async function seedAdmin(conn) {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'change-this-password';
  const passwordHash = await bcrypt.hash(password, 10);
  await conn.query(
    'INSERT INTO admin_users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
    [username, passwordHash]
  );
  console.log(`Seeded admin user "${username}"`);
}

async function main() {
  const conn = await pool.getConnection();
  try {
    await seedServices(conn);
    await seedProducts(conn);
    await seedCertifications(conn);
    await seedDistricts(conn); // must run before seedOffices, which links offices to districts
    await seedOffices(conn);
    await seedFaqs(conn);
    await seedStats(conn);
    await seedGallery(conn);
    await seedSettings(conn);
    await seedAdmin(conn);
    console.log('Database seeded successfully.');
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
