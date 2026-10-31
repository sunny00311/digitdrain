/**
 * NaliSentry - Leaflet Interactive Map Module
 * Handles drainage marker rendering, status filtering, and map interactions
 */

const NaliMap = (function () {
  let mapInstance = null;
  let markersLayer = null;
  let currentFilter = "all";
  let activeMarkersMap = new Map();

  // Custom DivIcon generator based on drainage status
  function createMarkerIcon(point) {
    const status = point.status;
    const pulseClass = status === "critical" ? "critical" : (status === "warning" ? "warning" : "normal");
    
    // Custom HTML for the marker pin with pulsing ring
    const html = `
      <div class="nali-marker-pin ${pulseClass}" title="${point.id}: ${point.name}">
        <span>${point.waterLevel}</span>
      </div>
    `;

    return L.divIcon({
      className: 'custom-nali-icon',
      html: html,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  // Create popup HTML
  function createPopupContent(point) {
    const statusBadgeClass = `badge-${point.status}`;
    const percentFill = Math.min(100, Math.round((point.waterLevel / point.maxDepth) * 100));

    return `
      <div class="popup-card">
        <div class="popup-top">
          <span class="popup-id">${point.id}</span>
          <span class="badge ${statusBadgeClass}">${point.status.toUpperCase()}</span>
        </div>
        <div class="popup-name">${point.name}</div>
        <div style="font-size: 0.78rem; color: #94a3b8;">${point.zone}</div>
        
        <div class="popup-level-box">
          <span style="font-size: 0.8rem; color: #94a3b8;">Water Level</span>
          <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: #ffffff;">${point.waterLevel} cm</span>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: #64748b; margin-bottom: 4px;">
            <span>Capacity (${point.waterLevel}/${point.maxDepth} cm)</span>
            <span>${percentFill}%</span>
          </div>
          <div style="height: 5px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden;">
            <div style="width: ${percentFill}%; height: 100%; background: ${point.status === 'critical' ? 'var(--status-critical)' : (point.status === 'warning' ? 'var(--status-warning)' : 'var(--status-normal)')};"></div>
          </div>
        </div>

        <div style="font-size: 0.76rem; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
          <span>Warn: ${point.warningThreshold}cm</span>
          <span>Crit: ${point.criticalThreshold}cm</span>
          <span>Flow: ${point.flowRate} m³/s</span>
        </div>

        <div class="popup-actions">
          <button class="btn btn-primary btn-sm" style="width: 100%; font-size: 0.78rem; padding: 6px;" onclick="window.NaliDashboard && window.NaliDashboard.openDetailModal('${point.id}')">
            Full Telemetry
          </button>
        </div>
      </div>
    `;
  }

  // Initialize the Leaflet Map
  function init(mapElementId = "drainage-map") {
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) return;

    // Center on central coordinates of Delhi urban drainage network
    const defaultCenter = [28.6139, 77.2090];
    const defaultZoom = 12;

    mapInstance = L.map(mapElementId, {
      zoomControl: true,
      attributionControl: true
    }).setView(defaultCenter, defaultZoom);

    // CartoDB Dark Matter / Positron or OpenStreetMap with clean tiles
    // Using CartoDB Dark Matter for sleek modern environmental monitoring aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);

    markersLayer = L.layerGroup().addTo(mapInstance);

    renderMarkers();
    setupFilterEvents();
  }

  // Render markers according to filter
  function renderMarkers() {
    if (!markersLayer || !window.NaliData) return;

    markersLayer.clearLayers();
    activeMarkersMap.clear();

    const points = window.NaliData.getPoints();

    points.forEach(point => {
      if (currentFilter !== "all" && point.status !== currentFilter) {
        return;
      }

      const icon = createMarkerIcon(point);
      const marker = L.marker([point.latitude, point.longitude], { icon: icon });

      marker.bindPopup(createPopupContent(point), {
        maxWidth: 320,
        className: 'custom-leaflet-popup'
      });

      marker.addTo(markersLayer);
      activeMarkersMap.set(point.id, marker);
    });
  }

  // Set filter (all, normal, warning, critical)
  function setFilter(status) {
    currentFilter = status;
    renderMarkers();
  }

  // Smoothly center and open popup for a specific point
  function focusPoint(pointId) {
    if (!mapInstance || !activeMarkersMap.has(pointId)) {
      // If it's filtered out, reset filter to 'all' first
      setFilter("all");
      // update filter chips UI if present
      document.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.status === 'all');
      });
    }

    const marker = activeMarkersMap.get(pointId);
    if (marker) {
      const latLng = marker.getLatLng();
      mapInstance.flyTo(latLng, 14, {
        duration: 1.2
      });
      setTimeout(() => {
        marker.openPopup();
      }, 1250);
    }
  }

  // Attach filter chip listeners
  function setupFilterEvents() {
    const filterButtons = document.querySelectorAll('[data-map-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterStatus = btn.dataset.mapFilter;
        setFilter(filterStatus);
      });
    });
  }

  return {
    init: init,
    renderMarkers: renderMarkers,
    setFilter: setFilter,
    focusPoint: focusPoint
  };
})();

if (typeof window !== "undefined") {
  window.NaliMap = NaliMap;
}
