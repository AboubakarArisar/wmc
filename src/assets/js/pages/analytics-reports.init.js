/**
 * Theme: WMC - Bootstrap 5 Responsive Admin Dashboard
 * Author: Mannatthemes
 * Analytics Reports Js
 */


var chart = {
  series: [
    {
      name: "2024",
      data: [ 2.7, 2.2, 1.3, 2.5, 1, 2.5, 1.2, 1.2, 2.7, 1, 3.6, 2.1,],
    },
    {
      name: "2023",
      data: [ -2.3, -1.9, -1, -2.1, -1.3, -2.2, -1.1, -2.3, -2.8, -1.1, -2.5, -1.5,],
    },
  ],
  chart: {
    toolbar: {
      show: false,
    },
    type: "bar",
    fontFamily: "inherit",
    foreColor: "#adb0bb",
    height: 350,
    stacked: true,
    offsetX: -15,
  },
  colors: ["var(--bs-primary)", "var(--bs-secondary)"],
  plotOptions: {
    bar: {
      horizontal: false,
      barHeight: "80%",
      columnWidth: "12%",
      borderRadius: [3],
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "all",
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: true,
    strokeDashArray: 3,
    padding: {
      top: 0,
      bottom: 0,
      right: 0,
    },
    borderColor: "rgba(0,0,0,0.05)",
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  yaxis: {
    min: -5,
    max: 5,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yaxis: {
    tickAWMC: 4,
  },
};

var chart = new ApexCharts(
  document.querySelector("#reports-bar"),
  chart
);
chart.render();

// Add dynamic range filter for Metrics
(function () {
  var labelEl = document.getElementById('metricsRangeLabel');
  var menuEl = document.getElementById('metricsRangeMenu');
  if (!labelEl || !menuEl) return;

  var rangeToSeries = {
    today: [1.2, 0.8, 1.1, 0.9, 1.0, 0.7, 0.6, 0.8, 1.1, 0.9, 0.7, 0.8],
    lastWeek: [1.8, 1.2, 1.3, 1.4, 1.1, 1.5, 1.2, 1.0, 1.6, 1.4, 1.3, 1.2],
    lastMonth: [2.1, 1.7, 1.4, 1.8, 1.5, 1.9, 1.6, 1.3, 1.9, 1.7, 1.6, 1.5],
    thisYear: [2.7, 2.2, 1.3, 2.5, 1, 2.5, 1.2, 1.2, 2.7, 1, 3.6, 2.1]
  };

  function titleCase(text) {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function (str) { return str.toUpperCase(); })
      .trim();
  }

  menuEl.addEventListener('click', function (e) {
    var target = e.target;
    if (!target.classList.contains('dropdown-item')) return;
    e.preventDefault();

    var range = target.getAttribute('data-range');
    if (!range || !rangeToSeries[range]) return;

    // Update label
    labelEl.textContent = titleCase(range);

    // Update chart data (only first series for demo)
    try {
      chart.updateSeries([
        { name: '2024', data: rangeToSeries[range] },
        chart.w.globals.series.length > 1 ? { name: '2023', data: chart.w.config.series[1].data } : null
      ].filter(Boolean));
    } catch (err) {
      console.error('Failed updating chart series for range', range, err);
    }
  });
})();

// Map


var map_2 = new jsVectorMap({
  map: 'world',
  selector: '#map_2',
  mapBgColor: '#F7F8F9',
  zoomOnScroll: false,
  zoomButtons: false,
  markers: [{
          name: "Greenland",
          coords: [72, -42]
      },
      {
          name: "Canada",
          coords: [56.1304, -106.3468]
      },
      {
          name: "Brazil",
          coords: [-14.2350, -51.9253]
      },
      {
          name: "Egypt",
          coords: [26.8206, 30.8025]
      },
      {
          name: "Russia",
          coords: [61, 105]
      },
      {
          name: "China",
          coords: [35.8617, 104.1954]
      },
      {
          name: "United States",
          coords: [37.0902, -95.7129]
      },
      {
          name: "Norway",
          coords: [60.472024, 8.468946]
      },
      {
          name: "Ukraine",
          coords: [48.379433, 31.16558]
      },
  ],
  lines: [{
          from: "Canada",
          to: "Egypt"
      },
      {
          from: "Russia",
          to: "Egypt"
      },
      {
          from: "Greenland",
          to: "Egypt"
      },
      {
          from: "Brazil",
          to: "Egypt"
      },
      {
          from: "United States",
          to: "Egypt"
      },
      {
          from: "China",
          to: "Egypt"
      },
      {
          from: "Norway",
          to: "Egypt"
      },
      {
          from: "Ukraine",
          to: "Egypt"
      },
  ],
  labels: {
      markers: {
          render: marker => marker.name
      },
  },
  lineStyle: {
      animation: true,
      strokeDasharray: "6 3 6",
  },
  regionStyle: {
      initial: {
          fill: 'rgba(169,183,197, 0.3)',
          fillOpacity: 1,
      },
  },
  markerStyle: {
      initial: {
          r: 5, // Marker width
          fill: '#22c55e', // Marker color
          fillOpacity: 1, // The opacity of the marker shape
          stroke: '#FFF', // Stroke
          strokeWidth: 1, // the stroke width
          strokeOpacity: .65, // The stroke opacity
      },
      // All options in initial object can be overitten in hover, selected, selectedHover object as well.
      hover: {
          stroke: 'black',
          cursor: 'pointer',
          strokeWidth: 2,
      },
      selected: {
          fill: 'blue'
      },
      selectedHover: {
          fill: 'red'
      }
  },
});

