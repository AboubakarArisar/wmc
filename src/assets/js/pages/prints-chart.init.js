// Prints per Week Chart Initialization
import dataService from '../services/data-service.js';

class PrintsChartController {
    constructor() {
        this.chart = null;
        this.init();
    }

    async init() {
        try {
            // Wait for data to be available
            const data = await dataService.getPrintsPerWeek();
            this.createChart(data);
            
            // Set up real-time updates
            dataService.addListener('printsPerWeek', (data) => {
                this.updateChart(data);
            });
            
        } catch (error) {
            console.error('Error initializing prints chart:', error);
            // Create chart with mock data
            const mockData = dataService.getMockPrintsPerWeek();
            this.createChart(mockData);
        }
    }

    createChart(data) {
        const chartElement = document.getElementById('prints_per_week');
        if (!chartElement) {
            console.error('Prints chart element not found');
            return;
        }

        // Prepare data for ApexCharts
        const chartData = {
            series: [{
                name: 'Prints',
                data: data.map(item => item.count)
            }],
            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: true
                }
            },
            xaxis: {
                categories: data.map(item => {
                    const date = new Date(item.week);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })
            },
            yaxis: {
                title: {
                    text: 'Number of Prints'
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            colors: ['#667eea'],
            grid: {
                borderColor: '#f1f1f1'
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " prints"
                    }
                }
            }
        };

        // Initialize ApexCharts
        if (window.ApexCharts) {
            this.chart = new ApexCharts(chartElement, chartData);
            this.chart.render();
        } else {
            console.error('ApexCharts not loaded');
        }
    }

    updateChart(data) {
        if (this.chart) {
            this.chart.updateSeries([{
                name: 'Prints',
                data: data.map(item => item.count)
            }]);
            
            this.chart.updateOptions({
                xaxis: {
                    categories: data.map(item => {
                        const date = new Date(item.week);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    })
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrintsChartController();
});

export default PrintsChartController;
