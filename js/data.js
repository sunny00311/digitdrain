/**
 * NaliSentry - Simulated Environmental Drainage Telemetry Data
 * Scope: Frontend prototype. All readings, coordinates, and alerts are simulated sample data.
 */

const NaliData = (function () {
  // Base configuration thresholds (in cm)
  const DEFAULT_WARNING = 60;
  const DEFAULT_CRITICAL = 80;

  // Helper to determine status from level and thresholds
  function computeStatus(level, warning = DEFAULT_WARNING, critical = DEFAULT_CRITICAL) {
    if (level === null || level === undefined) return "offline";
    if (level >= critical) return "critical";
    if (level >= warning) return "warning";
    return "normal";
  }

  // Realistic drainage points across an urban municipal drainage network (New Delhi catchment zone)
  const initialPoints = [
    {
      id: "NS-001",
      name: "Connaught Place Central Sump",
      zone: "Central Zone",
      latitude: 28.6315,
      longitude: 77.2167,
      waterLevel: 42,
      maxDepth: 120,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 1.4, // m³/s
      battery: 94,
      sensorStatus: "online",
      lastUpdated: "Just now",
      description: "Primary stormwater sump connecting radial storm drains."
    },
    {
      id: "NS-002",
      name: "Barapullah Drain Culvert A",
      zone: "South Zone",
      latitude: 28.5862,
      longitude: 77.2415,
      waterLevel: 88,
      maxDepth: 150,
      warningThreshold: 65,
      criticalThreshold: 80,
      flowRate: 3.8,
      battery: 89,
      sensorStatus: "online",
      lastUpdated: "1 min ago",
      description: "Major arterial discharge channel; high siltation tendency."
    },
    {
      id: "NS-003",
      name: "Minto Bridge Underpass Drain",
      zone: "Central Zone",
      latitude: 28.6385,
      longitude: 77.2289,
      waterLevel: 92,
      maxDepth: 130,
      warningThreshold: 55,
      criticalThreshold: 75,
      flowRate: 4.1,
      battery: 98,
      sensorStatus: "online",
      lastUpdated: "2 mins ago",
      description: "Critical low-lying railway underpass prone to rapid flash pooling."
    },
    {
      id: "NS-004",
      name: "Ring Road Lajpat Nagar Conduit",
      zone: "South Zone",
      latitude: 28.5684,
      longitude: 77.2433,
      waterLevel: 68,
      maxDepth: 110,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 2.2,
      battery: 92,
      sensorStatus: "online",
      lastUpdated: "3 mins ago",
      description: "Subsurface roadside runoff conduit along Ring Road belt."
    },
    {
      id: "NS-005",
      name: "ITO Junction Spillway",
      zone: "East Zone",
      latitude: 28.6297,
      longitude: 77.2468,
      waterLevel: 74,
      maxDepth: 140,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 2.6,
      battery: 81,
      sensorStatus: "online",
      lastUpdated: "5 mins ago",
      description: "Yamuna river regulator outlet feeder channel."
    },
    {
      id: "NS-006",
      name: "Nehru Place Commercial Canal",
      zone: "South Zone",
      latitude: 28.5492,
      longitude: 77.2526,
      waterLevel: 35,
      maxDepth: 100,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 0.9,
      battery: 95,
      sensorStatus: "online",
      lastUpdated: "4 mins ago",
      description: "Enclosed commercial district stormwater main."
    },
    {
      id: "NS-007",
      name: "Najafgarh Trunk Drain No. 4",
      zone: "West Zone",
      latitude: 28.6221,
      longitude: 77.0854,
      waterLevel: 86,
      maxDepth: 160,
      warningThreshold: 65,
      criticalThreshold: 82,
      flowRate: 5.2,
      battery: 76,
      sensorStatus: "online",
      lastUpdated: "6 mins ago",
      description: "Heavy volume regional stormwater channel outfall."
    },
    {
      id: "NS-008",
      name: "Dwarka Sector 10 Sump Gate",
      zone: "West Zone",
      latitude: 28.5812,
      longitude: 77.0583,
      waterLevel: 51,
      maxDepth: 120,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 1.1,
      battery: 90,
      sensorStatus: "online",
      lastUpdated: "8 mins ago",
      description: "Retention basin inlet gate with mechanical trash screen."
    },
    {
      id: "NS-009",
      name: "Kashmere Gate Metro Outfall",
      zone: "North Zone",
      latitude: 28.6675,
      longitude: 77.2285,
      waterLevel: 62,
      maxDepth: 110,
      warningThreshold: 58,
      criticalThreshold: 78,
      flowRate: 1.8,
      battery: 88,
      sensorStatus: "online",
      lastUpdated: "7 mins ago",
      description: "Transit interchange gravity storm relief sewer."
    },
    {
      id: "NS-010",
      name: "Pul Prahladpur Underpass Basin",
      zone: "South Zone",
      latitude: 28.5085,
      longitude: 77.2912,
      waterLevel: 94,
      maxDepth: 150,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 4.8,
      battery: 96,
      sensorStatus: "online",
      lastUpdated: "Just now",
      description: "High priority sunken junction with dual pump telemetry."
    },
    {
      id: "NS-011",
      name: "Rohini Sector 16 Storm Channel",
      zone: "North Zone",
      latitude: 28.7231,
      longitude: 77.1215,
      waterLevel: 28,
      maxDepth: 100,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 0.6,
      battery: 99,
      sensorStatus: "online",
      lastUpdated: "12 mins ago",
      description: "Paved suburban feeder drain flowing smoothly."
    },
    {
      id: "NS-012",
      name: "Civil Lines Old Canal Culvert",
      zone: "North Zone",
      latitude: 28.6792,
      longitude: 77.2218,
      waterLevel: 67,
      maxDepth: 110,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 2.1,
      battery: 85,
      sensorStatus: "online",
      lastUpdated: "9 mins ago",
      description: "Historic masonry culvert with moderate debris buildup."
    },
    {
      id: "NS-013",
      name: "Janakpuri District Center Drain",
      zone: "West Zone",
      latitude: 28.6291,
      longitude: 77.0815,
      waterLevel: 38,
      maxDepth: 95,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 0.8,
      battery: 91,
      sensorStatus: "online",
      lastUpdated: "15 mins ago",
      description: "Commercial plaza drainage lateral with active perimeter grate."
    },
    {
      id: "NS-014",
      name: "Nehru Nagar Culvert Drain",
      zone: "South Zone",
      latitude: 28.5721,
      longitude: 77.2514,
      waterLevel: 84,
      maxDepth: 120,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 3.6,
      battery: 93,
      sensorStatus: "online",
      lastUpdated: "2 mins ago",
      description: "Water level has exceeded configured critical safety threshold."
    },
    {
      id: "NS-015",
      name: "Mayur Vihar Phase 1 Wetland Inflow",
      zone: "East Zone",
      latitude: 28.6045,
      longitude: 77.2942,
      waterLevel: 49,
      maxDepth: 130,
      warningThreshold: 65,
      criticalThreshold: 85,
      flowRate: 1.5,
      battery: 97,
      sensorStatus: "online",
      lastUpdated: "11 mins ago",
      description: "Ecological overflow regulator discharging into flood plain."
    },
    {
      id: "NS-016",
      name: "Saket Metro Overpass Channel",
      zone: "South Zone",
      latitude: 28.5204,
      longitude: 77.2064,
      waterLevel: 31,
      maxDepth: 100,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 0.7,
      battery: 94,
      sensorStatus: "online",
      lastUpdated: "14 mins ago",
      description: "Elevated bridge viaduct downspout junction."
    },
    {
      id: "NS-017",
      name: "Shahdara Trunk Storm Sewer",
      zone: "East Zone",
      latitude: 28.6721,
      longitude: 77.2985,
      waterLevel: 71,
      maxDepth: 130,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 2.8,
      battery: 82,
      sensorStatus: "online",
      lastUpdated: "6 mins ago",
      description: "Trans-Yamuna high density drainage trunk under heavy runoff."
    },
    {
      id: "NS-018",
      name: "Karol Bagh Road Underway Box",
      zone: "Central Zone",
      latitude: 28.6514,
      longitude: 77.1906,
      waterLevel: 76,
      maxDepth: 110,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 2.9,
      battery: 79,
      sensorStatus: "online",
      lastUpdated: "4 mins ago",
      description: "Underground stormwater retention box with high sediment."
    },
    {
      id: "NS-019",
      name: "Hauz Khas Village Siphon Chamber",
      zone: "South Zone",
      latitude: 28.5539,
      longitude: 77.1947,
      waterLevel: 22,
      maxDepth: 90,
      warningThreshold: 60,
      criticalThreshold: 80,
      flowRate: 0.4,
      battery: 98,
      sensorStatus: "online",
      lastUpdated: "18 mins ago",
      description: "Heritage lake diversion siphon; optimal water velocity."
    },
    {
      id: "NS-020",
      name: "Wazirabad Barrage Floodway Bypass",
      zone: "North Zone",
      latitude: 28.7125,
      longitude: 77.2341,
      waterLevel: 89,
      maxDepth: 180,
      warningThreshold: 65,
      criticalThreshold: 85,
      flowRate: 6.4,
      battery: 87,
      sensorStatus: "online",
      lastUpdated: "3 mins ago",
      description: "Northern catchment spillway regulating seasonal river runoff."
    }
  ];

  // Attach dynamic status to each point
  let points = initialPoints.map(p => ({
    ...p,
    status: computeStatus(p.waterLevel, p.warningThreshold, p.criticalThreshold)
  }));

  // Initial alerts constructed from critical and warning points
  let alerts = [
    {
      id: "ALT-001",
      pointId: "NS-014",
      pointName: "Nehru Nagar Culvert Drain",
      severity: "critical",
      title: "CRITICAL — NS-014",
      message: "Water level has exceeded the configured critical safety threshold.",
      waterLevel: 84,
      threshold: 80,
      status: "active",
      timestamp: "10:32 AM",
      actionRequired: "Immediate dispatch of suction team and debris clearing required."
    },
    {
      id: "ALT-002",
      pointId: "NS-003",
      pointName: "Minto Bridge Underpass Drain",
      severity: "critical",
      title: "CRITICAL — NS-003",
      message: "Water level approaching flash-flood surcharge level in underpass basin.",
      waterLevel: 92,
      threshold: 75,
      status: "active",
      timestamp: "10:30 AM",
      actionRequired: "Automatic pump check & traffic diversion protocol initiated."
    },
    {
      id: "ALT-003",
      pointId: "NS-010",
      pointName: "Pul Prahladpur Underpass Basin",
      severity: "critical",
      title: "CRITICAL — NS-010",
      message: "Secondary retention sump capacity above 90%. High overflow risk.",
      waterLevel: 94,
      threshold: 80,
      status: "active",
      timestamp: "10:28 AM",
      actionRequired: "Auxiliary diesel pumps engaged; technician alerted."
    },
    {
      id: "ALT-004",
      pointId: "NS-002",
      pointName: "Barapullah Drain Culvert A",
      severity: "critical",
      title: "CRITICAL — NS-002",
      message: "Heavy upstream deluge entering arterial culvert outfall.",
      waterLevel: 88,
      threshold: 80,
      status: "active",
      timestamp: "10:24 AM",
      actionRequired: "Inspect sluice gate clearance."
    },
    {
      id: "ALT-005",
      pointId: "NS-018",
      pointName: "Karol Bagh Road Underway Box",
      severity: "warning",
      title: "WARNING — NS-018",
      message: "Water level reached warning threshold (76 cm / 60 cm limit).",
      waterLevel: 76,
      threshold: 60,
      status: "active",
      timestamp: "10:15 AM",
      actionRequired: "Monitor runoff inflow velocity."
    },
    {
      id: "ALT-006",
      pointId: "NS-005",
      pointName: "ITO Junction Spillway",
      severity: "warning",
      title: "WARNING — NS-005",
      message: "Spillway gate level elevated due to upstream rainfall runoff.",
      waterLevel: 74,
      threshold: 60,
      status: "active",
      timestamp: "10:05 AM",
      actionRequired: "Sluice gate check scheduled."
    }
  ];

  // Realistic 24-hour historical readings for chart visualization
  const hourlyTimeLabels = [
    "00:00", "02:00", "04:00", "06:00", "08:00", "10:00", 
    "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
  ];

  // Dynamic time-series generation based on selected point
  function getHistoricalSeries(pointId = "NS-014") {
    const point = points.find(p => p.id === pointId) || points[0];
    const current = point.waterLevel;
    
    // Simulate realistic fluctuation curve reaching current value
    const factor = current / 80;
    const values = [
      Math.round(25 * factor),
      Math.round(22 * factor),
      Math.round(20 * factor),
      Math.round(28 * factor),
      Math.round(35 * factor),
      Math.round(48 * factor),
      Math.round(62 * factor),
      Math.round(71 * factor),
      Math.round(78 * factor),
      Math.round(82 * factor),
      Math.round(current * 0.96),
      current
    ];

    return {
      labels: hourlyTimeLabels,
      values: values,
      pointName: point.name,
      pointId: point.id,
      warningThreshold: point.warningThreshold,
      criticalThreshold: point.criticalThreshold,
      currentLevel: current
    };
  }

  // Get aggregated stats
  function getStats() {
    const total = points.length;
    let normal = 0;
    let warning = 0;
    let critical = 0;
    let offline = 0;
    let sumLevel = 0;

    points.forEach(p => {
      sumLevel += p.waterLevel;
      if (p.status === "normal") normal++;
      else if (p.status === "warning") warning++;
      else if (p.status === "critical") critical++;
      else offline++;
    });

    const activeAlerts = alerts.filter(a => a.status === "active").length;
    const avgLevel = Math.round(sumLevel / total);

    return {
      total,
      normal,
      warning,
      critical,
      offline,
      activeAlerts,
      avgLevel
    };
  }

  // Toggle acknowledge state for an alert
  function acknowledgeAlert(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = alert.status === "active" ? "acknowledged" : "active";
      alert.acknowledgedAt = alert.status === "acknowledged" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
      return alert;
    }
    return null;
  }

  // Simulation: Trigger simulated rainfall to demonstrate dynamic telemetry updates
  function simulateRainfall(delta = 10) {
    points = points.map(p => {
      const newLevel = Math.min(p.maxDepth, Math.max(10, p.waterLevel + Math.round((Math.random() * 2 - 0.5) * delta)));
      return {
        ...p,
        waterLevel: newLevel,
        status: computeStatus(newLevel, p.warningThreshold, p.criticalThreshold),
        lastUpdated: "Just now"
      };
    });
    return points;
  }

  // Reset to initial baseline
  function resetSimulation() {
    points = initialPoints.map(p => ({
      ...p,
      status: computeStatus(p.waterLevel, p.warningThreshold, p.criticalThreshold)
    }));
    return points;
  }

  return {
    getPoints: () => points,
    getPointById: (id) => points.find(p => p.id === id),
    getAlerts: () => alerts,
    getStats: getStats,
    acknowledgeAlert: acknowledgeAlert,
    getHistoricalSeries: getHistoricalSeries,
    simulateRainfall: simulateRainfall,
    resetSimulation: resetSimulation,
    DEFAULT_WARNING,
    DEFAULT_CRITICAL
  };
})();

// Attach to window for global access across scripts
if (typeof window !== "undefined") {
  window.NaliData = NaliData;
}
