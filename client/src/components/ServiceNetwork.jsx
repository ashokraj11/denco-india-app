import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { PhoneIcon, PersonIcon, BuildingIcon, LocationPinIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const DISTRICTS = [
  { name: 'Ariyalur', status: 'live', left: 67.6, top: 45.4 },
  { name: 'Chengalpattu', status: 'live', left: 87.8, top: 19.3 },
  { name: 'Chennai', status: 'soon', left: 93.8, top: 12.6 },
  { name: 'Coimbatore', status: 'live', left: 20.3, top: 47.4 },
  { name: 'Cuddalore', status: 'live', left: 82.6, top: 35.1 },
  { name: 'Dharmapuri', status: 'live', left: 46.9, top: 28.7 },
  { name: 'Dindigul', status: 'live', left: 42.2, top: 58.3 },
  { name: 'Erode', status: 'live', left: 37.3, top: 42.0 },
  { name: 'Kallakurichi', status: 'live', left: 65.1, top: 35.3 },
  { name: 'Kancheepuram', status: 'live', left: 81.5, top: 16.7 },
  { name: 'Kanyakumari', status: 'soon', left: 30.6, top: 95.2 },
  { name: 'Karur', status: 'live', left: 45.2, top: 48.4 },
  { name: 'Krishnagiri', status: 'live', left: 48.3, top: 22.1 },
  { name: 'Madurai', status: 'live', left: 46.1, top: 65.8 },
  { name: 'Mayiladuthurai', status: 'live', left: 80.4, top: 46.0 },
  { name: 'Nagapattinam', status: 'live', left: 84.5, top: 51.8 },
  { name: 'Namakkal', status: 'live', left: 47.2, top: 44.0 },
  { name: 'Nilgiris', status: 'soon', left: 14.2, top: 40.8 },
  { name: 'Perambalur', status: 'live', left: 63.1, top: 43.9 },
  { name: 'Pudukkottai', status: 'live', left: 61.7, top: 58.2 },
  { name: 'Ramanathapuram', status: 'live', left: 62.0, top: 75.2 },
  { name: 'Ranipet', status: 'soon', left: 73.2, top: 15.2 },
  { name: 'Salem', status: 'live', left: 46.7, top: 36.6 },
  { name: 'Sivaganga', status: 'live', left: 54.1, top: 67.1 },
  { name: 'Tenkasi', status: 'live', left: 27.9, top: 82.1 },
  { name: 'Thanjavur', status: 'live', left: 68.9, top: 51.3 },
  { name: 'Theni', status: 'live', left: 31.7, top: 64.4 },
  { name: 'Thoothukudi', status: 'soon', left: 46.2, top: 85.5 },
  { name: 'Tiruchirappalli', status: 'live', left: 58.6, top: 51.1 },
  { name: 'Tirunelveli', status: 'soon', left: 37.8, top: 86.3 },
  { name: 'Tirupathur', status: 'live', left: 56.1, top: 22.5 },
  { name: 'Tiruppur', status: 'live', left: 28.6, top: 45.9 },
  { name: 'Tiruvallur', status: 'soon', left: 86.2, top: 11.7 },
  { name: 'Tiruvannamalai', status: 'live', left: 67.4, top: 27.0 },
  { name: 'Tiruvarur', status: 'live', left: 79.9, top: 51.6 },
  { name: 'Vellore', status: 'live', left: 68.7, top: 15.4 },
  { name: 'Viluppuram', status: 'live', left: 76.8, top: 31.9 },
  { name: 'Virudhunagar', status: 'live', left: 42.5, top: 71.5 },
  { name: 'Puducherry', status: 'live', left: 83.7, top: 31.9 },
  { name: 'Karaikal', status: 'live', left: 84.4, top: 49.1 }
];

const VISIBLE_LIMIT = 6;

function OfficeCard({ office, delay }) {
  const [expanded, setExpanded] = useState(false);
  const locations = office.locations || [];
  const overflow = locations.length > VISIBLE_LIMIT;
  const visible = overflow && !expanded ? locations.slice(0, VISIBLE_LIMIT) : locations;
  const hiddenCount = locations.length - VISIBLE_LIMIT;

  return (
    <Reveal as="div" className="manager-card" delay={delay}>
      <div className="manager-head">
        <span className="manager-avatar" style={office.isHeadOffice ? { background: 'var(--accent)' } : undefined}>
          {office.isHeadOffice ? <BuildingIcon /> : <PersonIcon />}
        </span>
        <div>
          <h5>{office.name}</h5>
          <span className="manager-role">{office.role}</span>
        </div>
      </div>
      <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="manager-phone">
        <PhoneIcon />{office.phone}
      </a>
      <div>
        <span className="loc-label">{office.isHeadOffice ? 'Direct Service Areas' : 'Service Locations'}</span>
        <div className="loc-chips">
          {visible.map((loc) => (
            <span className="loc-chip" key={loc}>{loc}</span>
          ))}
          {overflow && (
            <button type="button" className="loc-chip-toggle" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function ServiceNetwork() {
  const { data: offices, loading } = useFetch('/offices');

  return (
    <section className="service-network" id="service-network">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Pan-Regional Coverage</span>
          <span className="network-stat"><LocationPinIcon />75+ Locations Served</span>
          <h2>Our Service Network</h2>
          <p>Serving 75+ locations across Tamil Nadu &amp; Puducherry. Our dedicated area managers ensure timely case collection, delivery and customer support across our extensive service network.</p>
        </Reveal>

        <Reveal as="div" className="network-map-layout">
          <div className="tn-map-card">
            <div className="tn-map-card-head">
              <div>
                <h4>Tamil Nadu Coverage</h4>
                <span>District-wise service footprint</span>
              </div>
              <div className="tn-map-badge">31/38<small>Districts</small></div>
            </div>

            <div className="tn-map-frame">
              <img src="/tn-map.jpg" alt="Tamil Nadu district map showing Denco India service coverage" loading="lazy" />
              {DISTRICTS.map((d) => (
                <span
                  key={d.name}
                  className={`map-pin is-${d.status}`}
                  data-name={d.name}
                  style={{ left: `${d.left}%`, top: `${d.top}%` }}
                ></span>
              ))}
            </div>

            <div className="tn-map-legend">
              <span className="legend-item"><span className="legend-dot is-live"></span>Active service district</span>
              <span className="legend-item"><span className="legend-dot is-soon"></span>Not yet serviced</span>
            </div>
            <p className="tn-map-note">Hover a marker for the district name. Coverage plotted from our current area-manager network below, plus Puducherry &amp; Karaikal.</p>
          </div>

          <div className="manager-grid">
            {loading && <p>Loading service network…</p>}
            {offices?.map((office, i) => (
              <OfficeCard office={office} key={office.id} delay={(i % 3) + 1} />
            ))}
          </div>
        </Reveal>
      </div>
      <DecorativeLayer hostIndex={7} />
    </section>
  );
}
