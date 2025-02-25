// 初始化ECharts实例
const trendChart = echarts.init(document.getElementById('trendChart'));
const distributionChart = echarts.init(document.getElementById('distributionChart'));

// 页面加载完成后执行
$(document).ready(function() {
    // 设置默认日期范围（最近7天）
    setDefaultDateRange();
    // 初始化图表
    initCharts();
    // 加载初始数据
    loadData();
    
    // 绑定事件处理
    $('#searchBtn').click(handleSearch);
    $('#resetBtn').click(handleReset);
    $('#exportBtn').click(handleExport);
    $('#timeRange').change(handleTimeRangeChange);
    $('#statisticsType').change(handleStatisticsTypeChange);
});

// 设置默认日期范围
function setDefaultDateRange() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    $('#endDate').val(formatDate(today));
    $('#startDate').val(formatDate(sevenDaysAgo));
}

// 格式化日期
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 初始化图表配置
function initCharts() {
    // 能耗趋势图配置
    const trendOption = {
        title: {
            text: '能耗趋势分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name: '能耗量'
        },
        series: [{
            name: '能耗量',
            type: 'line',
            data: [],
            smooth: true
        }]
    };

    // 能耗分布图配置
    const distributionOption = {
        title: {
            text: '能耗分布分析'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            name: '能耗分布',
            type: 'pie',
            radius: '50%',
            data: []
        }]
    };

    trendChart.setOption(trendOption);
    distributionChart.setOption(distributionOption);
}

// 加载数据
function loadData() {
    // 模拟数据，实际项目中应该通过API获取
    const mockData = {
        dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
        consumption: [120, 132, 101, 134, 90],
        tableData: [
            {date: '2024-01-01', hydrogen: 120, power: 80, efficiency: 0.85, time: 8, distance: 150},
            {date: '2024-01-02', hydrogen: 132, power: 85, efficiency: 0.82, time: 9, distance: 165},
            {date: '2024-01-03', hydrogen: 101, power: 75, efficiency: 0.88, time: 7, distance: 130},
            {date: '2024-01-04', hydrogen: 134, power: 88, efficiency: 0.81, time: 9.5, distance: 170},
            {date: '2024-01-05', hydrogen: 90, power: 70, efficiency: 0.89, time: 6.5, distance: 120}
        ]
    };

    updateCharts(mockData);
    updateTable(mockData.tableData);
}

// 更新图表数据
function updateCharts(data) {
    // 更新趋势图
    trendChart.setOption({
        xAxis: {
            data: data.dates
        },
        series: [{
            data: data.consumption
        }]
    });

    // 更新分布图
    const distributionData = data.tableData.map(item => ({
        name: item.date,
        value: item.hydrogen
    }));
    
    distributionChart.setOption({
        series: [{
            data: distributionData
        }]
    });
}

// 更新表格数据
function updateTable(data) {
    const tbody = $('#dataTableBody');
    tbody.empty();
    
    data.forEach(item => {
        tbody.append(`
            <tr>
                <td>${item.date}</td>
                <td>${item.hydrogen}</td>
                <td>${item.power}</td>
                <td>${item.efficiency}</td>
                <td>${item.time}</td>
                <td>${item.distance}</td>
            </tr>
        `);
    });
}

// 处理查询按钮点击
function handleSearch() {
    const searchParams = {
        timeRange: $('#timeRange').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        statisticsType: $('#statisticsType').val()
    };
    
    // 这里应该调用API获取数据
    console.log('搜索参数：', searchParams);
    loadData(); // 临时使用模拟数据
}

// 处理重置按钮点击
function handleReset() {
    $('#timeRange').val('day');
    setDefaultDateRange();
    $('#statisticsType').val('hydrogen');
    loadData();
}

// 处理导出按钮点击
function handleExport() {
    // 实现导出功能
    alert('数据导出功能待实现');
}

// 处理时间范围变化
function handleTimeRangeChange() {
    // 根据选择的时间范围更新日期选择器
    const range = $('#timeRange').val();
    // 实现相应的日期范围调整逻辑
}

// 处理统计类型变化
function handleStatisticsTypeChange() {
    // 根据选择的统计类型更新图表
    loadData();
}

// 窗口大小改变时重绘图表
window.addEventListener('resize', function() {
    trendChart.resize();
    distributionChart.resize();
}); 