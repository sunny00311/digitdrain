/**
 * NaliSentry - Dashboard Core Application Logic
 * Coordinates telemetry data, metrics, alert panel, Chart.js trends, and table interactions
 */

const NaliDashboard = (function () {
  let waterChartInstance = null;
  let currentTableFilter = "all";
  let currentSearchQuery = "";
  let currentAlertFilter = "all";
  let activeChartPointId = "NS-014"; // Default to a critical point for demonstration

  // Initialize all dashboard components
  function init() {
    updateClock();
    setInterval(updateClock, 1000);

    renderSummaryMetrics();
    renderAlerts();
    initChart(activeChartPointId);
    renderTable();
    populateChartSelector();
    setupEventListeners();
  }

  // Update live simulated UTC/IST clock
  function updateClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour12: false }) + " IST";
  }

  // Render metric summary counters
  function renderSummaryMetrics() {
    if (!window.NaliData) return;
    const stats = window.NaliData.getStats();

    const totalEl = document.getElementById("stat-total");
    const normalEl = document.getElementById("stat-normal");
    const warningEl = document.getElementById("stat-warning");
    const criticalEl = document.getElementById("stat-critical");
    const avgEl = document.getElementById("stat-avg-level");
    const activeAlertBadge = document.getElementById("active-alert-badge");

    if (totalEl) totalEl.textContent = stats.total;
    if (normalEl) normalEl.textContent = stats.normal;
    if (warningEl) warningEl.textContent = stats.warning;
    if (criticalEl) criticalEl.textContent = stats.critical;
    if (avgEl) avgEl.textContent = stats.avgLevel + " cm";
    if (activeAlertBadge) activeAlertBadge.textContent = stats.activeAlerts;
  }

  // Render Alert Cards
  function renderAlerts() {
    if (!window.NaliData) return;
    const alertListEl = document.getElementById("alerts-container");
    if (!alertListEl) return;

    let alerts = window.NaliData.getAlerts();

    if (currentAlertFilter === "active") {
      alerts = alerts.filter(a => a.status === "active");
    } else if (currentAlertFilter === "acknowledged") {
      alerts = alerts.filter(a => a.status === "acknowledged");
    }

    if (alerts.length === 0) {
      alertListEl.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #64748b;">
          <p>No alerts in this category.</p>
        </div>
      `;
      return;
    }

    alertListEl.innerHTML = alerts.map(alert => {
      const isAck = alert.status === "acknowledged";
      const badgeClass = alert.severity === "critical" ? "badge-critical" : "badge-warning";
      
      return `
        <div class="alert-item ${alert.severity} ${isAck ? 'acknowledged' : ''}" id="alert-card-${alert.id}">
          <div class="alert-top">
            <div class="alert-title-row">
              <span class="badge ${badgeClass}">${alert.severity.toUpperCase()}</span>
              <span class="alert-title-text">${alert.title}</span>
            </div>
            <span class="alert-time">${alert.timestamp}</span>
          </div>

          <div class="alert-msg">${alert.message}</div>

          <div class="alert-meta">
            <span><strong>Location:</strong> ${alert.pointName}</span>
            <span><strong>Level:</strong> ${alert.waterLevel} cm (Limit: ${alert.threshold} cm)</span>
          </div>

          <div class="alert-actions">
            <button class="btn btn-outline btn-sm" onclick="NaliDashboard.viewOnMap('${alert.pointId}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              View on Map
            </button>
            <button class="btn-ack ${isAck ? 'active-ack' : ''}" onclick="NaliDashboard.toggleAcknowledge('${alert.id}')">
              ${isAck ? '✓ Acknowledged' : 'Acknowledge'}
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Toggle acknowledge state for an alert
  function toggleAcknowledge(alertId) {
    if (!window.NaliData) return;
    window.NaliData.acknowledgeAlert(alertId);
    renderAlerts();
    renderSummaryMetrics();
  }

  // Focus point on map and scroll to map section
  function viewOnMap(pointId) {
    if (window.NaliMap) {
      window.NaliMap.focusPoint(pointId);
      const mapCard = document.getElementById("map-section");
      if (mapCard) {
        mapCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  // Initialize or update the Chart.js Water-Level chart
  function initChart(pointId = "NS-014") {
    if (!window.NaliData || typeof Chart === "undefined") return;
    const canvas = document.getElementById("waterLevelChart");
    if (!canvas) return;

    const seriesData = window.NaliData.getHistoricalSeries(pointId);

    if (waterChartInstance) {
      waterChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");

    // Dynamic gradient fill for the chart area
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.45)");
    gradient.addColorStop(1, "rgba(6, 182, 212, 0.0)");

    waterChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: seriesData.labels,
        datasets: [
          {
            label: `${seriesData.pointName} (${seriesData.pointId})`,
            data: seriesData.values,
            borderColor: "#06b6d4",
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#06b6d4",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: "Critical Threshold (80 cm)",
            data: Array(seriesData.labels.length).fill(seriesData.criticalThreshold),
            borderColor: "rgba(239, 68, 68, 0.85)",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          },
          {
            label: "Warning Threshold (60 cm)",
            data: Array(seriesData.labels.length).fill(seriesData.warningThreshold),
            borderColor: "rgba(245, 158, 11, 0.85)",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#ffffff",
            bodyColor: "#94a3b8",
            borderColor: "rgba(56, 189, 248, 0.3)",
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y} cm`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#64748b", font: { family: "'JetBrains Mono', monospace", size: 11 } }
          },
          y: {
            min: 0,
            max: 120,
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#64748b",
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              callback: function (val) { return val + " cm"; }
            }
          }
        }
      }
    });
  }

  // Populate Point Selector dropdown for Chart
  function populateChartSelector() {
    const select = document.getElementById("chartPointSelect");
    if (!select || !window.NaliData) return;

    const points = window.NaliData.getPoints();
    select.innerHTML = points.map(p => `
      <option value="${p.id}" ${p.id === activeChartPointId ? 'selected' : ''}>
        ${p.id} — ${p.name}
      </option>
    `).join("");

    select.addEventListener("change", (e) => {
      activeChartPointId = e.target.value;
      initChart(activeChartPointId);
    });
  }

  // Render Drainage Points Table
  function renderTable() {
    if (!window.NaliData) return;
    const tbody = document.getElementById("drainage-table-body");
    if (!tbody) return;

    let points = window.NaliData.getPoints();

    // Filter by Status Tab
    if (currentTableFilter !== "all") {
      points = points.filter(p => p.status === currentTableFilter);
    }

    // Filter by Search Query
    if (currentSearchQuery.trim() !== "") {
      const q = currentSearchQuery.toLowerCase();
      points = points.filter(p => 
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q)
      );
    }

    if (points.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px; color: #64748b;">
            No drainage points found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = points.map(p => {
      const percent = Math.min(100, Math.round((p.waterLevel / p.maxDepth) * 100));
      const badgeClass = `badge-${p.status}`;
      const fillClass = p.status;

      return `
        <tr>
          <td class="point-id-cell">${p.id}</td>
          <td class="point-name-cell">
            ${p.name}
            <small>${p.zone} • Cap: ${p.maxDepth}cm</small>
          </td>
          <td>
            <div class="level-bar-wrap">
              <span class="mono" style="font-weight: 700; color: #fff; min-width: 44px;">${p.waterLevel} cm</span>
              <div class="level-bar-track">
                <div class="level-bar-fill ${fillClass}" style="width: ${percent}%;"></div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${badgeClass}">${p.status.toUpperCase()}</span>
          </td>
          <td style="font-size: 0.8rem; color: #64748b;">${p.lastUpdated}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm" onclick="NaliDashboard.viewOnMap('${p.id}')" title="Locate on Map">
                Map
              </button>
              <button class="btn btn-primary btn-sm" onclick="NaliDashboard.openDetailModal('${p.id}')" title="View Telemetry">
                Details
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // Open Full Detail Modal for a specific drainage point
  function openDetailModal(pointId) {
    if (!window.NaliData) return;
    const point = window.NaliData.getPointById(pointId);
    if (!point) return;

    const modal = document.getElementById("detailModal");
    const titleEl = document.getElementById("modalPointTitle");
    const bodyEl = document.getElementById("modalPointBody");

    if (!modal || !titleEl || !bodyEl) return;

    titleEl.textContent = `${point.id} — ${point.name}`;

    const percent = Math.round((point.waterLevel / point.maxDepth) * 100);

    bodyEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="badge badge-${point.status}">${point.status.toUpperCase()} STATUS</span>
        <span style="font-size: 0.82rem; color: #94a3b8;">Telemetry: Online (${point.sensorStatus})</span>
      </div>

      <div class="modal-grid">
        <div class="modal-stat-box">
          <div class="label">Current Water Level</div>
          <div class="val" style="color: ${point.status === 'critical' ? 'var(--status-critical)' : 'var(--accent-cyan)'};">
            ${point.waterLevel} cm
          </div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">${percent}% of ${point.maxDepth} cm maximum depth</div>
        </div>

        <div class="modal-stat-box">
          <div class="label">Flow Rate Velocity</div>
          <div class="val">${point.flowRate} m³/s</div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">Acoustic Doppler Sensor</div>
        </div>

        <div class="modal-stat-box">
          <div class="label">Warning Threshold</div>
          <div class="val" style="color: var(--status-warning);">${point.warningThreshold} cm</div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">Standard advisory mark</div>
        </div>

        <div class="modal-stat-box">
          <div class="label">Critical Overflow Mark</div>
          <div class="val" style="color: var(--status-critical);">${point.criticalThreshold} cm</div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">Immediate dispatch threshold</div>
        </div>

        <div class="modal-stat-box">
          <div class="label">Coordinates (Lat, Long)</div>
          <div class="val mono" style="font-size: 0.95rem;">${point.latitude.toFixed(4)}, ${point.longitude.toFixed(4)}</div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">${point.zone}</div>
        </div>

        <div class="modal-stat-box">
          <div class="label">Telemetry Node Battery</div>
          <div class="val" style="color: #10b981;">${point.battery}%</div>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">Solar & Supercapacitor Backed</div>
        </div>
      </div>

      <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="font-size: 0.8rem; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Site Description & Dispatch Notes:</div>
        <p style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">${point.description}</p>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
        <button class="btn btn-outline btn-sm" onclick="NaliDashboard.closeModal()">Close</button>
        <button class="btn btn-primary btn-sm" onclick="NaliDashboard.closeModal(); NaliDashboard.viewOnMap('${point.id}');">
          Center on Map
        </button>
      </div>
    `;

    modal.classList.add("open");
  }

  function closeModal() {
    const modal = document.getElementById("detailModal");
    if (modal) modal.classList.remove("open");
  }

  // Setup DOM event listeners
  function setupEventListeners() {
    // Search input for Table
    const searchInput = document.getElementById("pointSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value;
        renderTable();
      });
    }

    // Table Status Filter Buttons
    const tableFilters = document.querySelectorAll("[data-table-filter]");
    tableFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        tableFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTableFilter = btn.dataset.tableFilter;
        renderTable();
      });
    });

    // Alert Filter Tabs
    const alertFilters = document.querySelectorAll("[data-alert-filter]");
    alertFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        alertFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentAlertFilter = btn.dataset.alertFilter;
        renderAlerts();
      });
    });

    // Simulation Trigger: Rainfall
    const rainBtn = document.getElementById("btn-simulate-rain");
    if (rainBtn) {
      rainBtn.addEventListener("click", () => {
        if (!window.NaliData) return;
        window.NaliData.simulateRainfall(14);
        refreshAllViews();
      });
    }

    // Simulation Trigger: Reset
    const resetBtn = document.getElementById("btn-reset-sim");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!window.NaliData) return;
        window.NaliData.resetSimulation();
        refreshAllViews();
      });
    }

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // Close modal on overlay click
    const modal = document.getElementById("detailModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Close modal on Esc key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // Refresh all components after data changes
  function refreshAllViews() {
    renderSummaryMetrics();
    renderAlerts();
    renderTable();
    if (window.NaliMap) {
      window.NaliMap.renderMarkers();
    }
    initChart(activeChartPointId);
  }

  return {
    init: init,
    toggleAcknowledge: toggleAcknowledge,
    viewOnMap: viewOnMap,
    openDetailModal: openDetailModal,
    closeModal: closeModal,
    refreshAllViews: refreshAllViews
  };
})();

// Auto-boot on DOM ready if on dashboard page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("stat-total")) {
    NaliDashboard.init();
    if (window.NaliMap) {
      window.NaliMap.init("drainage-map");
    }
  }
});

if (typeof window !== "undefined") {
  window.NaliDashboard = NaliDashboard;
}
