import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { PhoneIcon, PersonIcon, BuildingIcon, LocationPinIcon } from './icons/UiIcons';
import Reveal from './Reveal';
import DecorativeLayer from './DecorativeLayer';

const VISIBLE_LIMIT = 6;

function OfficeCard({ office, delay }) {
  const [expanded, setExpanded] = useState(false);
  const areaNames = (office.areas || []).map((a) => a.areaName);
  const overflow = areaNames.length > VISIBLE_LIMIT;
  const visible = overflow && !expanded ? areaNames.slice(0, VISIBLE_LIMIT) : areaNames;
  const hiddenCount = areaNames.length - VISIBLE_LIMIT;

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
          {visible.length === 0 && <span className="loc-chip" style={{ opacity: 0.6 }}>No areas assigned yet</span>}
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
  const { data: districts, loading: districtsLoading } = useFetch('/districts');

  // The 38 real Tamil Nadu districts, excluding the Puducherry/Karaikal union
  // territory points, for the "X/38 Districts" badge.
  const tnDistricts = (districts || []).filter((d) => d.slug !== 'puducherry' && d.slug !== 'karaikal');
  const liveTnCount = tnDistricts.filter((d) => d.status === 'live').length;

  return (
    <section className="service-network" id="service-network">
      <div className="container">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Pan-Regional Coverage</span>
          <span className="network-stat"><LocationPinIcon />75+ Locations Served</span>
          <h2>Our Service Network</h2>
          <p>Serving locations across Tamil Nadu &amp; Puducherry. Our dedicated area managers ensure timely case collection, delivery and customer support across our extensive service network.</p>
        </Reveal>

        <Reveal as="div" className="network-map-layout">
          <div className="tn-map-card">
            <div className="tn-map-card-head">
              <div>
                <h4>Tamil Nadu Coverage</h4>
                <span>District-wise service footprint</span>
              </div>
              <div className="tn-map-badge">{liveTnCount}/{tnDistricts.length || 38}<small>Districts</small></div>
            </div>

            <div className="tn-map-frame">
              <img src="/tn-map.jpg" alt="Tamil Nadu district map showing Denco India service coverage" loading="lazy" />
              {!districtsLoading && districts?.map((d) => (
                <span
                  key={d.id}
                  className={`map-pin is-${d.status}`}
                  data-name={d.name}
                  style={{ left: `${d.leftPct}%`, top: `${d.topPct}%` }}
                ></span>
              ))}
            </div>

            <div className="tn-map-legend">
              <span className="legend-item"><span className="legend-dot is-live"></span>Active service district</span>
              <span className="legend-item"><span className="legend-dot is-soon"></span>Not yet serviced</span>
            </div>
            <p className="tn-map-note">Hover a marker for the district name. Coverage plotted live from our current area-manager network below, plus Puducherry &amp; Karaikal.</p>
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
