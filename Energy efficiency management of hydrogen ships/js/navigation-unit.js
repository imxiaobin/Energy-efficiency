// 初始化图表
function initCharts() {
    const charts = {
        powerOutput: new Chart(document.getElementById('powerOutputChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '功率输出 (kW)',
                    data: [],
                    borderColor: '#2980b9',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }),
        efficiency: new Chart(document.getElementById('efficiencyChart').getContext('2d'), {
            // 效率图表配置
        }),
        hydrogenConsumption: new Chart(document.getElementById('hydrogenConsumptionChart').getContext('2d'), {
            // 氢耗图表配置
        }),
        temperature: new Chart(document.getElementById('temperatureChart').getContext('2d'), {
            // 温度图表配置
        })
    };
    return charts;
}

// 更新实时数据
function updateRealTimeData() {
    const fuelCellPower = 450 + Math.random() * 100;
    const hydrogenPressure = 345 + Math.random() * 10;
    const fuelCellEfficiency = 58 + Math.random() * 4;
    
    document.getElementById('fuelCellPower').textContent = `${fuelCellPower.toFixed(1)} kW`;
    document.getElementById('hydrogenPressure').textContent = `${hydrogenPressure.toFixed(1)} bar`;
    document.getElementById('fuelCellEfficiency').textContent = `${fuelCellEfficiency.toFixed(1)}%`;
    
    updateStatusIndicators(fuelCellPower, hydrogenPressure, fuelCellEfficiency);
}

// 更新状态指示器
function updateStatusIndicators(power, pressure, efficiency) {
    const powerIndicator = document.querySelector('#fuelCellPower').parentElement.nextElementSibling;
    powerIndicator.className = `status-indicator ${power > 400 ? 'status-good' : 'status-warning'}`;
}

// 更新图表数据
function updateCharts(charts) {
    const now = new Date().toLocaleTimeString();
    
    Object.values(charts).forEach(chart => {
        chart.data.labels.push(now);
        chart.data.datasets[0].data.push(450 + Math.random() * 100);
        
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update();
    });
}

// 初始化页面
function initNavigationUnit() {
    const charts = initCharts();
    setInterval(() => updateRealTimeData(), 1000);
    setInterval(() => updateCharts(charts), 5000);
}

// 启动实时数据更新
function startRealTimeUpdates() {
    // 实时数据更新代码...
}

// 其他功能函数... 