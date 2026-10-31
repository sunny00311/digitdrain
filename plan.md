# NaliSentry — Static Drainage Monitoring Dashboard

## 1. Project Overview

Build a responsive website for NaliSentry, a smart drainage monitoring concept.

The website will demonstrate how drainage locations could be monitored through an interactive map, a dashboard, and a visual alert system.

**Technology stack:**
- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet.js for the interactive map
- OpenStreetMap for map tiles
- Chart.js for dashboard charts

**Scope:** Frontend demonstration only. All drainage readings, statistics, and alerts are simulated sample data.

## 2. Project Structure

```text
nalisentry/
├── index.html
├── dashboard.html
├── plan.md
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── dashboard.js
│   ├── map.js
│   └── data.js
└── assets/
    ├── images/
    └── icons/
```

## 3. Landing Page — index.html

### Navigation
- NaliSentry logo
- Home
- Features
- How It Works
- About
- Open Dashboard button

### Hero Section
Headline: **Smarter Drainage. Safer Communities.**

Description: Monitor drainage conditions, identify high-risk locations, and visualize potential overflow situations through one centralized dashboard.

Buttons:
- Explore Dashboard
- Discover Features

Include a visual preview of a drainage map with colored markers and a sample alert card.

### Statistics Section

Display sample statistics:

- 120 Monitored Drainage Points
- 86 Normal
- 24 Warning
- 10 Critical

These values are illustrative and must be labeled as demo data.

### Features Section

Create feature cards for:

1. Interactive Drainage Map
2. Water-Level Monitoring
3. Critical Alert Visualization
4. Historical Water-Level Charts
5. Drainage Point Status
6. Maintenance Prioritization

### How It Works

Present four steps:

1. Sensors measure drainage water levels.
2. A controller collects readings.
3. A monitoring platform evaluates conditions.
4. Alerts identify locations requiring attention.

This section explains the proposed system; the static website does not actually connect to sensors.

### Footer

Include the project name, a short description, navigation links, and a demo disclaimer.

## 4. Dashboard — dashboard.html

### Layout

Create a professional monitoring dashboard with:
- Sidebar navigation
- Top header
- Summary cards
- Interactive drainage map
- Recent alerts
- Water-level chart
- Drainage points table

### Summary Cards

Display:
- Total drainage points
- Normal locations
- Warning locations
- Critical locations

Use JavaScript to calculate these values from the sample dataset.

### Interactive Map

Use Leaflet.js and OpenStreetMap tiles.

Features:
- Display sample drainage locations.
- Show colored markers for different statuses.
- Open a popup when a marker is selected.
- Display the drainage point ID, water level, status, and location.
- Filter markers by status.
- Provide a map legend.

Status colors:
- Green: Normal
- Amber: Warning
- Red: Critical
- Gray: Offline

The map is interactive, but its drainage information comes from the local sample dataset.

### Alert Panel

Display sample alerts such as:

**CRITICAL — NS-014**

Water level has exceeded the configured critical threshold.

Location: Sample drainage location  
Water Level: 84 cm  
Status: Requires inspection

Buttons:
- View on Map
- Acknowledge

Acknowledgement should update the alert's visual state in the browser. It does not notify a real maintenance team.

### Water-Level Chart

Use Chart.js to display sample water-level readings over time.

Include:
- Water-level trend
- Time labels
- Measurement units
- Warning and critical threshold indicators where practical

### Drainage Points Table

Columns:
- Point ID
- Location
- Water Level
- Status
- Last Updated
- Action

Include:
- Search by ID or location
- Filter by status
- View Details button

## 5. Sample Data — data.js

Create a local JavaScript dataset.

Each drainage point should contain:

```javascript
{
  id: "NS-001",
  name: "Sector 12 Drain",
  latitude: 28.6139,
  longitude: 77.2090,
  waterLevel: 42,
  warningThreshold: 60,
  criticalThreshold: 80,
  status: "normal",
  lastUpdated: "10:30 AM"
}
```

Use illustrative coordinates and readings for the prototype. Do not represent them as verified real-world drainage measurements.

Calculate status from the water level and configured thresholds rather than maintaining contradictory values.

## 6. JavaScript Functionality

Implement the following client-side features:

- Mobile navigation toggle.
- Dashboard navigation.
- Dynamic summary statistics.
- Map markers and popups.
- Status filters.
- Search functionality.
- Drainage point detail views.
- Sample alert acknowledgement.
- Chart rendering.
- Responsive sidebar toggle.

Keep the sample data in one place so the map, statistics, alerts, and table remain consistent.

Do not implement backend communication, real sensor ingestion, authentication, or external notification delivery in this version.

## 7. Design Requirements

Use a clean, modern environmental-monitoring interface.

Recommended colors:
- Deep navy for primary branding
- Teal for secondary accents
- Green for normal conditions
- Amber for warnings
- Red for critical events
- Light gray for page backgrounds

Requirements:
- Responsive desktop, tablet, and mobile layouts
- Consistent spacing and typography
- Accessible buttons and labels
- Clear status indicators
- Minimal animations
- Reusable CSS variables
- Loading and empty states where appropriate

## 8. Completion Criteria

The static prototype is complete when:

- [ ] Landing page is fully designed.
- [ ] Dashboard opens from the landing page.
- [ ] Dashboard summary cards display correct sample counts.
- [ ] Interactive map displays drainage markers.
- [ ] Marker popups show the correct information.
- [ ] Search and filters work.
- [ ] Alerts are displayed clearly.
- [ ] Alert acknowledgement changes the visual state.
- [ ] Water-level chart renders.
- [ ] Drainage points table displays the sample dataset.
- [ ] Mobile navigation and dashboard layouts work.
- [ ] All sample data is clearly identified as simulated.
- [ ] No backend or hardware integration is required.

## 9. Development Order

1. Build `index.html`.
2. Style the landing page in `style.css`.
3. Build the dashboard layout in `dashboard.html`.
4. Create the sample dataset in `data.js`.
5. Implement dashboard statistics and table rendering.
6. Implement the Leaflet map in `map.js`.
7. Add charts and alert interactions.
8. Add responsive styles.
9. Test all interactions in the browser.

**Final goal:** Deliver a polished, interactive static prototype that demonstrates the NaliSentry concept without requiring a server-side application or physical hardware.