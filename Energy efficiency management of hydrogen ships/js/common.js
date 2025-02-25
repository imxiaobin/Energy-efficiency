document.addEventListener('DOMContentLoaded', function() {
    initSidebarMenus();
    loadHeader();
    loadPageContent();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    initHeaderNavigation();
    initPageLinks();
    loadReportsFromLocalStorage();
    initCharts();
});

function loadSidebar() {
    const sidebar = document.getElementById('commonSidebar');
    sidebar.innerHTML = `
        <div class="menu-item" id="menuItem1">
            <div class="menu-item-wrap" onclick="toggleMenuItem('menu1')">
                <h2>船舶信息采集</h2>
                <ul id="menu1">
                    <li onclick="loadPage('船舶航行单元')">船舶航行单元</li>
                    <li onclick="loadPage('船舶动力系统单元')">船舶动力系统单元</li>
                </ul>
            </div>
        </div>
        <!-- 其他菜单项 -->
    `;
}

function loadHeader() {
    const header = document.getElementById('commonHeader');
    header.innerHTML = `
        <nav class="navbar">
            <ul class="nav-list">
                <li class="nav-item"><a href="#" onclick="loadPage('home')">首页</a></li>
                <li class="nav-item"><a href="#" onclick="loadPage('about')">关于我们</a></li>
                <li class="nav-item"><a href="#" onclick="loadPage('services')">服务</a></li>
                <li class="nav-item"><a href="#" onclick="loadPage('contact')">联系方式</a></li>
            </ul>
        </nav>
        <div class="header">
            <h1>船舶能效监测系统</h1>
            <div class="current-time" id="currentTime"></div>
        </div>
    `;
}

function updateCurrentTime() {
    const currentTime = new Date();
    document.getElementById('currentTime').innerText = currentTime.toLocaleTimeString();
}

function toggleMenuItem(menuId) {
    const menuItems = document.querySelectorAll('.sidebar .menu-item');
    const targetMenuItem = document.getElementById(menuId).closest('.menu-item');
    const subMenu = document.getElementById(menuId);
    
    if (targetMenuItem.classList.contains('active')) {
        targetMenuItem.classList.remove('active');
        requestAnimationFrame(() => {
            subMenu.style.maxHeight = '0';
            subMenu.style.opacity = '0';
        });
    } else {
        menuItems.forEach(item => {
            if (item !== targetMenuItem) {
                item.classList.remove('active');
                const otherSubMenu = item.querySelector('ul');
                if (otherSubMenu) {
                    requestAnimationFrame(() => {
                        otherSubMenu.style.maxHeight = '0';
                        otherSubMenu.style.opacity = '0';
                    });
                }
            }
        });
        
        targetMenuItem.classList.add('active');
        requestAnimationFrame(() => {
            subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
            subMenu.style.opacity = '1';
        });
    }
}

function loadPage(pageName) {
    const contentDiv = document.getElementById('pageContent');
    
    fetch(`pages/${pageName}.html`)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            if (pageName === '船舶航行单元') {
                initNavigationUnit();
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

// 页眉导航功能
function initHeaderNavigation() {
    const homeButton = document.querySelector('.nav-item a[title="首页"]');
    
    if (homeButton) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault();
            smoothPageTransition('船舶信息管理.html');
        });
    }
}

// 修改侧边栏菜单初始化函数
function initSidebarMenus() {
    // 为每个菜单项的h2标题添加点击事件
    document.querySelectorAll('.sidebar .menu-item h2').forEach(title => {
        title.addEventListener('click', function() {
            // 获取当前菜单项的ul元素id
            const menuId = this.closest('.menu-item').querySelector('ul').id;
            toggleMenuItem(menuId);
        });
    });
}

// 页面加载时初始化侧边栏菜单
document.addEventListener('DOMContentLoaded', function() {
    initSidebarMenus();
});

// 页面切换动画函数
function smoothPageTransition(targetUrl) {
    const mainContent = document.querySelector('.main-content');
    
    // 添加淡出动画
    mainContent.classList.add('fade-out');

    // 使用fetch获取新页面内容
    fetch(targetUrl)
        .then(response => response.text())
        .then(html => {
            // 创建一个临时的div来解析HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // 获取新页面的主内容区域
            const newMainContent = tempDiv.querySelector('.main-content').innerHTML;
            
            // 等待淡出动画完成后更新内容
            setTimeout(() => {
                // 只更新主内容区域
                mainContent.innerHTML = newMainContent;
                
                // 添加淡入动画
                mainContent.classList.remove('fade-out');
                mainContent.classList.add('fade-in');
                
                // 初始化新页面的功能
                initPageFunctions();
            }, 300);
        })
        .catch(error => {
            console.error('Error loading page:', error);
            window.location.href = targetUrl; // 如果出错则直接跳转
        });
}

// 初始化页面功能
function initPageFunctions() {
    // 根据页面类型初始化不同的功能
    if (document.querySelector('.report-search-area')) {
        // 日报记录页面的初始化
        initReportPage();
    } else if (document.querySelector('.ship-info-area')) {
        // 船舶信息页面的初始化
        initShipInfoPage();
    }
    // ... 其他页面的初始化
}

// 修改侧边栏点击事件
document.querySelectorAll('.sidebar li').forEach(link => {
    const href = link.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    if (href) {
        link.removeAttribute('onclick');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            smoothPageTransition(href);
        });
    }
});

// 修改页面内链接的点击事件
function initPageLinks() {
    document.querySelectorAll('.sidebar li').forEach(link => {
        const originalOnclick = link.getAttribute('onclick');
        if (originalOnclick && originalOnclick.includes('window.location.href')) {
            const targetUrl = originalOnclick.match(/'([^']+)'/)[1];
            link.removeAttribute('onclick');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                smoothPageTransition(targetUrl);
            });
        }
    });
}

// 页面加载完成后的处理
document.addEventListener('DOMContentLoaded', function() {
    // 添加淡入动画
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('fade-out');
    
    setTimeout(() => {
        mainContent.classList.remove('fade-out');
        mainContent.classList.add('fade-in');
        document.body.classList.remove('page-transition');
        
        // 恢复滚动位置
        const scrollPos = sessionStorage.getItem('scrollPos');
        if (scrollPos) {
            window.scrollTo(0, parseInt(scrollPos));
            sessionStorage.removeItem('scrollPos');
        }
    }, 100);

    initSidebarMenus();
    initHeaderNavigation();
    initPageLinks();
});

// 导入功能
function importShipData() {
    document.getElementById('shipDataFile').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 这里处理文件内容
            console.log('File content:', e.target.result);
            // TODO: 解析文件内容并更新表格
        };
        reader.readAsText(file);
    }
}

// 功能
let currentPage = 1;
let totalPages = 1;
let pageSize = 10;

// 更新分页信息
function updatePagination() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('totalRecords').textContent = dailyReports.length;
}

// 跳转到第一页
function goToFirstPage() {
    currentPage = 1;
    updatePagination();
    loadTableData();
}

// 跳转到上一页
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        loadTableData();
    }
}

// 跳转到下一页
function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        loadTableData();
    }
}

// 跳转到最后一页
function goToLastPage() {
    currentPage = totalPages;
    updatePagination();
    loadTableData();
}

// 跳转到指定页
function jumpToPage() {
    const jumpPageInput = document.getElementById('jumpPageInput');
    const page = parseInt(jumpPageInput.value);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updatePagination();
        loadTableData();
    } else {
        alert('请输入有效的页码');
    }
}

// 改变每页显示数量
function changePageSize(size) {
    pageSize = parseInt(size);
    currentPage = 1;
    loadTableData();
}

// 加载表格数据
function loadTableData() {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    // 计算当前页的数据
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = dailyReports.slice(start, end);

    // 更新总页数
    totalPages = Math.ceil(dailyReports.length / pageSize);

    // 填充表格
    pageData.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.shipName}</td>
            <td>${report.voyageNo}</td>
            <td>${report.reportDate}</td>
            <td>${report.positionNS}</td>
            <td>${report.positionEW}</td>
            <td>${report.departurePort}</td>
            <td>${report.destinationPort}</td>
            <td>${report.eta}</td>
            <td>${report.timezone}</td>
            <td class="${report.missingInfo !== '无' ? 'missing-info' : ''}">${report.missingInfo}</td>
            <td>
                <div class="operation-btns">
                    <button class="operation-btn edit-btn" onclick="showAddReportDialog(${JSON.stringify(report)})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="operation-btn delete-btn" onclick="deleteReport('${report.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // 更新分页信息
    updatePagination();
}

// 初始化页面时加载数据
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    loadTableData();
    updatePagination();
});

// 添加日报相关功能

// 日报数据结构
let dailyReports = [];

// 显示新增/编辑对话框
function showAddReportDialog(reportData = null) {
    const dialog = document.getElementById('reportDialog');
    const form = document.getElementById('reportForm');
    const title = document.getElementById('dialogTitle');
    
    // 设置标题
    title.textContent = reportData ? '编辑日报记录' : '新增日报记录';
    
    // 如果是编辑，填充表单数据
    if (reportData) {
        form.dataset.editId = reportData.id;
        // 填充表单字段
        Object.keys(reportData).forEach(key => {
            const input = document.getElementById(key);
            if (input && key !== 'id' && key !== 'missingInfo') {
                input.value = reportData[key];
            }
        });
    } else {
        form.reset();
        form.dataset.editId = '';
        // 设置默认日期为今天
        document.getElementById('reportDate').value = new Date().toISOString().split('T')[0];
    }
    
    // 显示对话框
    dialog.style.display = 'block';
    
    // 添加遮罩层点击关闭功能
    dialog.onclick = function(e) {
        if (e.target === dialog) {
            closeReportDialog();
        }
    };
}

// 关闭对话框
function closeReportDialog() {
    document.getElementById('reportDialog').style.display = 'none';
}

// 处理表单提交
function handleReportSubmit(event) {
    event.preventDefault();
    
    // 收集表单数据
    const formData = {
        shipName: document.getElementById('shipName').value,
        voyageNo: document.getElementById('voyageNo').value,
        reportDate: document.getElementById('reportDate').value,
        positionNS: document.getElementById('positionNS').value,
        positionEW: document.getElementById('positionEW').value,
        departurePort: document.getElementById('departurePort').value,
        destinationPort: document.getElementById('destinationPort').value,
        eta: document.getElementById('eta').value,
        timezone: document.getElementById('timezone').value
    };

    // 验证数据
    const missingInfo = validateReportData(formData);
    
    // 获取编辑ID
    const editId = event.target.dataset.editId;
    
    if (editId) {
        // 更新现有记录
        updateReport(editId, formData, missingInfo);
        showNotification('记录更新成功', 'success');
    } else {
        // 添加新记录
        addNewReport(formData, missingInfo);
        showNotification('新记录添加成功', 'success');
    }
    
    closeReportDialog();
    refreshReportTable();
}

// 验证日报数据
function validateReportData(data) {
    const missingFields = [];
    
    // 检查必填字段
    if (!data.shipName) missingFields.push('船名');
    if (!data.voyageNo) missingFields.push('航次号');
    if (!data.reportDate) missingFields.push('报告日期');
    
    // 检查经纬度格式
    const nsPattern = /^[0-9]{1,2}°[0-9]{1,2}'[NS]$/;
    const ewPattern = /^[0-9]{1,3}°[0-9]{1,2}'[EW]$/;
    
    if (data.positionNS && !nsPattern.test(data.positionNS)) {
        missingFields.push('船位(NS)格式错误');
    }
    if (data.positionEW && !ewPattern.test(data.positionEW)) {
        missingFields.push('船位(EW)格式错误');
    }
    
    return missingFields.length > 0 ? missingFields.join(', ') : '无';
}

// 添加新日报
function addNewReport(data, missingInfo) {
    const newReport = {
        id: Date.now().toString(),
        ...data,
        missingInfo
    };
    dailyReports.push(newReport);
}

// 更新日报记录
function updateReport(id, data, missingInfo) {
    const index = dailyReports.findIndex(report => report.id === id);
    if (index !== -1) {
        dailyReports[index] = {
            id,
            ...data,
            missingInfo
        };
        
        // 保存到本地存储
        saveReportsToLocalStorage();
    }
}

// 删除日报
function deleteReport(id) {
    if (confirm('确定要删除这条记录吗？')) {
        dailyReports = dailyReports.filter(report => report.id !== id);
        refreshReportTable();
    }
}

// 刷新表格
function refreshReportTable() {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';
    
    dailyReports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.shipName}</td>
            <td>${report.voyageNo}</td>
            <td>${report.reportDate}</td>
            <td>${report.positionNS}</td>
            <td>${report.positionEW}</td>
            <td>${report.departurePort}</td>
            <td>${report.destinationPort}</td>
            <td>${report.eta}</td>
            <td>${report.timezone}</td>
            <td class="${report.missingInfo !== '无' ? 'missing-info' : ''}">${report.missingInfo}</td>
            <td>
                <div class="operation-btns">
                    <button class="operation-btn edit-btn" onclick="showAddReportDialog(${JSON.stringify(report)})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="operation-btn delete-btn" onclick="deleteReport('${report.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 导入日报信息
function importDailyReport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = handleReportFileSelect;
    input.click();
}

// 处理文件导入
function handleReportFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // 这里可以添加具体的文件解析逻辑
                const data = parseReportFile(e.target.result);
                dailyReports = dailyReports.concat(data);
                refreshReportTable();
                alert('导入功！');
            } catch (error) {
                alert('文件解析失败：' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// 导出日报信息
function exportDailyReport() {
    const data = dailyReports.map(report => ({
        shipName: report.shipName,
        voyageNo: report.voyageNo,
        reportDate: report.reportDate,
        positionNS: report.positionNS,
        positionEW: report.positionEW,
        departurePort: report.departurePort,
        destinationPort: report.destinationPort,
        eta: report.eta,
        timezone: report.timezone
    }));

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `日报记录_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 转换数据为CSV格式
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = [headers.join(',')];
    
    data.forEach(item => {
        const row = headers.map(header => {
            let cell = item[header] || '';
            // 如果单元格内容包含逗号，用引号包裹
            if (cell.toString().includes(',')) {
                cell = `"${cell}"`;
            }
            return cell;
        });
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

// 添加通知提示功能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 2秒后自动消失
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 保存数据到本地存储
function saveReportsToLocalStorage() {
    localStorage.setItem('dailyReports', JSON.stringify(dailyReports));
}

// 从本地存储加载数据
function loadReportsFromLocalStorage() {
    const savedReports = localStorage.getItem('dailyReports');
    if (savedReports) {
        dailyReports = JSON.parse(savedReports);
        refreshReportTable();
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background-color: #28a745;
    }

    .notification.error {
        background-color: #dc3545;
    }

    .notification.info {
        background-color: #17a2b8;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 页面加载时初始化数据
document.addEventListener('DOMContentLoaded', function() {
    loadReportsFromLocalStorage();
});

// 航次记录相关功能

// 航次数据结构
let voyageRecords = [];

// 显示新增/编辑航次对话框
function showAddVoyageDialog(voyageData = null) {
    const dialog = document.getElementById('voyageDialog');
    const form = document.getElementById('voyageForm');
    const title = document.getElementById('dialogTitle');
    
    title.textContent = voyageData ? '编辑航次记录' : '新增航次记录';
    
    if (voyageData) {
        form.dataset.editId = voyageData.id;
        Object.keys(voyageData).forEach(key => {
            const input = document.getElementById(key);
            if (input && key !== 'id') {
                input.value = voyageData[key];
            }
        });
    } else {
        form.reset();
        form.dataset.editId = '';
        document.getElementById('departureTime').value = new Date().toISOString().slice(0, 16);
    }
    
    dialog.style.display = 'block';
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    
    requestAnimationFrame(() => {
        dialog.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        dialog.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
    });
}

// 处理航次表单提交
function handleVoyageSubmit(event) {
    event.preventDefault();
    
    const formData = {
        shipName: document.getElementById('shipName').value,
        voyageNo: document.getElementById('voyageNo').value,
        departureTime: document.getElementById('departureTime').value,
        arrivalTime: document.getElementById('arrivalTime').value,
        departurePort: document.getElementById('departurePort').value,
        destinationPort: document.getElementById('destinationPort').value,
        distance: document.getElementById('distance').value,
        totalHydrogenConsumption: document.getElementById('totalHydrogenConsumption').value,
        averageHydrogenConsumption: document.getElementById('averageHydrogenConsumption').value,
        fuelCellEfficiency: document.getElementById('fuelCellEfficiency').value,
        energyEfficiency: document.getElementById('energyEfficiency').value,
        refuelingCount: document.getElementById('refuelingCount').value
    };

    // 验证数据
    if (!validateVoyageData(formData)) {
        return;
    }

    const editId = event.target.dataset.editId;
    
    // 添加淡出动画
    const dialog = document.getElementById('voyageDialog');
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        if (editId) {
            updateVoyage(editId, formData);
            showNotification('航次记录更新成功', 'success');
        } else {
            addNewVoyage(formData);
            showNotification('新航次记录添加成功', 'success');
        }
        
        // 关闭对话框
        closeVoyageDialog();
        
        // 刷新表格并添加动画效果
        refreshVoyageTableWithAnimation();
    }, 300);
}

// 验证航次数据
function validateVoyageData(data) {
    // 检查必填字段
    const requiredFields = ['shipName', 'voyageNo', 'departureTime', 'departurePort', 'destinationPort'];
    for (const field of requiredFields) {
        if (!data[field]) {
            showNotification(`${field} 不能为空`, 'error');
            return false;
        }
    }

    // 检查数值字段
    const numberFields = {
        'distance': '航程',
        'totalHydrogenConsumption': '氢耗总量',
        'averageHydrogenConsumption': '平均氢耗',
        'fuelCellEfficiency': '燃料电池效率',
        'energyEfficiency': '能量利用率',
        'refuelingCount': '加氢次数'
    };

    for (const [field, label] of Object.entries(numberFields)) {
        const value = parseFloat(data[field]);
        if (isNaN(value) || value < 0) {
            showNotification(`${label} 必须是有效的正数`, 'error');
            return false;
        }
    }

    // 检查效率值是否在0-100之间
    const efficiencyFields = ['fuelCellEfficiency', 'energyEfficiency'];
    for (const field of efficiencyFields) {
        const value = parseFloat(data[field]);
        if (value < 0 || value > 100) {
            showNotification(`${field} 必须在0-100之间`, 'error');
            return false;
        }
    }

    return true;
}

// 添加新航次记录
function addNewVoyage(data) {
    const newVoyage = {
        id: Date.now().toString(),
        ...data
    };
    voyageRecords.push(newVoyage);
    saveVoyagesToLocalStorage();
}

// 新航次记录
function updateVoyage(id, data) {
    const index = voyageRecords.findIndex(voyage => voyage.id === id);
    if (index !== -1) {
        voyageRecords[index] = {
            id,
            ...data
        };
        saveVoyagesToLocalStorage();
    }
}

// 删除航次记录
function deleteVoyage(id) {
    if (confirm('确定要删除这条航次记录吗？')) {
        voyageRecords = voyageRecords.filter(voyage => voyage.id !== id);
        saveVoyagesToLocalStorage();
        refreshVoyageTable();
        showNotification('航次记录已删除', 'success');
    }
}

// 刷新航次表格
function refreshVoyageTable() {
    const tbody = document.getElementById('voyageTableBody');
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = voyageRecords.slice(start, end);
    
    pageData.forEach(voyage => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${voyage.shipName}</td>
            <td>${voyage.voyageNo}</td>
            <td>${formatDateTime(voyage.departureTime)}</td>
            <td>${formatDateTime(voyage.arrivalTime)}</td>
            <td>${voyage.departurePort}</td>
            <td>${voyage.destinationPort}</td>
            <td>${voyage.distance}</td>
            <td>${voyage.totalHydrogenConsumption}</td>
            <td>${voyage.averageHydrogenConsumption}</td>
            <td>${voyage.fuelCellEfficiency}</td>
            <td>${voyage.energyEfficiency}</td>
            <td>${voyage.refuelingCount}</td>
            <td>
                <div class="operation-btns">
                    <button class="operation-btn edit-btn" onclick="showAddVoyageDialog(${JSON.stringify(voyage)})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="operation-btn delete-btn" onclick="deleteVoyage('${voyage.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePagination();
}

// 格式化日期时间
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 保存数据到本地存储
function saveVoyagesToLocalStorage() {
    localStorage.setItem('voyageRecords', JSON.stringify(voyageRecords));
}

// 从本地存储加载数据
function loadVoyagesFromLocalStorage() {
    const savedVoyages = localStorage.getItem('voyageRecords');
    if (savedVoyages) {
        voyageRecords = JSON.parse(savedVoyages);
        refreshVoyageTable();
    }
}

// 页面加载初始化数据
document.addEventListener('DOMContentLoaded', function() {
    loadVoyagesFromLocalStorage();
});

// 添加带动画效果的表格刷新函数
function refreshVoyageTableWithAnimation() {
    const tbody = document.getElementById('voyageTableBody');
    const rows = tbody.getElementsByTagName('tr');
    
    // 为现有行添加淡出动画
    Array.from(rows).forEach((row, index) => {
        row.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`;
        row.style.opacity = '0';
        row.style.transform = 'translateY(-10px)';
    });

    setTimeout(() => {
        // 清空表格
        tbody.innerHTML = '';
        
        // 获取当前页数据
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = voyageRecords.slice(start, end);
        
        // 添加新行并设置动画
        pageData.forEach((voyage, index) => {
            const row = document.createElement('tr');
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            row.innerHTML = `
                <td>${voyage.shipName}</td>
                <td>${voyage.voyageNo}</td>
                <td>${formatDateTime(voyage.departureTime)}</td>
                <td>${formatDateTime(voyage.arrivalTime)}</td>
                <td>${voyage.departurePort}</td>
                <td>${voyage.destinationPort}</td>
                <td>${voyage.distance}</td>
                <td>${voyage.totalHydrogenConsumption}</td>
                <td>${voyage.averageHydrogenConsumption}</td>
                <td>${voyage.fuelCellEfficiency}</td>
                <td>${voyage.energyEfficiency}</td>
                <td>${voyage.refuelingCount}</td>
                <td>
                    <div class="operation-btns">
                        <button class="operation-btn edit-btn" onclick="showAddVoyageDialog(${JSON.stringify(voyage)})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="operation-btn delete-btn" onclick="deleteVoyage('${voyage.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
            
            // 触发重排后添加动画
            requestAnimationFrame(() => {
                row.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`;
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            });
        });

        updatePagination();
    }, 300);
}

// 修改对话框关闭函数，添加动画
function closeVoyageDialog() {
    const dialog = document.getElementById('voyageDialog');
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        dialog.style.display = 'none';
        dialog.style.transform = 'scale(1)';
    }, 300);
}

// 全局变量
let charts = {};
let chartData = {
    temperature: [],
    pressure: [],
    flow: []
};
let currentTankId = 1;

// 储氢罐切换功能
function switchTank(tankId) {
    currentTankId = tankId;
    console.log('Switching to tank:', tankId); // 调试日志

    // 更新按钮状态
    document.querySelectorAll('.tank-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-tank')) === tankId) {
            btn.classList.add('active');
        }
    });

    // 更新状态面板数据
    updateTankStatus(tankId);

    // 重置并更新图表数据
    resetChartData();
    startRealTimeUpdate();
}

// 更新储氢罐状态数据
function updateTankStatus(tankId) {
    const tankData = {
        1: { shipName: "测试船舶001", speed: "12.5", pressure: "350", flow: "2.5" },
        2: { shipName: "测试船舶001", speed: "12.5", pressure: "345", flow: "2.3" },
        3: { shipName: "测试船舶001", speed: "12.5", pressure: "355", flow: "2.7" },
        4: { shipName: "测试船舶001", speed: "12.5", pressure: "348", flow: "2.4" }
    };

    const data = tankData[tankId];
    document.getElementById('currentShipName').textContent = data.shipName;
    document.getElementById('currentSpeed').textContent = `${data.speed} 节`;
    document.getElementById('currentPressure').textContent = `${data.pressure} bar`;
    document.getElementById('currentFlow').textContent = `${data.flow} kg/h`;
}

// 初始化图表
function initCharts() {
    console.log('Initializing charts...'); // 调试日志

    if (typeof echarts === 'undefined') {
        console.error('ECharts is not loaded');
        return;
    }

    // 通用配置项
    const commonOption = {
        grid: {
            top: 60,
            left: 60,
            right: 40,
            bottom: 40
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const data = params[0];
                return `${new Date(data.value[0]).toLocaleTimeString()}<br/>
                        ${data.seriesName}: ${data.value[1].toFixed(2)}`;
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false }
        }
    };

    // 初始化温度图表
    const temperatureChart = document.getElementById('temperatureChart');
    if (temperatureChart) {
        charts.temperature = echarts.init(temperatureChart);
        const temperatureOption = {
            ...commonOption,
            title: {
                text: '温度变化趋势',
                left: 'center'
            },
            yAxis: {
                type: 'value',
                name: '温度(°C)'
            },
            series: [{
                name: '温度',
                type: 'line',
                smooth: true,
                data: [],
                itemStyle: { color: '#ff7675' }
            }]
        };
        charts.temperature.setOption(temperatureOption);
    }

    // 初始化压力图表
    const pressureChart = document.getElementById('pressureChart');
    if (pressureChart) {
        charts.pressure = echarts.init(pressureChart);
        const pressureOption = {
            ...commonOption,
            title: {
                text: '压力变化趋势',
                left: 'center'
            },
            yAxis: {
                type: 'value',
                name: '压力(bar)'
            },
            series: [{
                name: '压力',
                type: 'line',
                smooth: true,
                data: [],
                itemStyle: { color: '#74b9ff' }
            }]
        };
        charts.pressure.setOption(pressureOption);
    }

    // 初始化流量图表
    const flowChart = document.getElementById('flowChart');
    if (flowChart) {
        charts.flow = echarts.init(flowChart);
        const flowOption = {
            ...commonOption,
            title: {
                text: '氢气流量趋势',
                left: 'center'
            },
            yAxis: {
                type: 'value',
                name: '流量(kg/h)'
            },
            series: [{
                name: '流量',
                type: 'line',
                smooth: true,
                data: [],
                itemStyle: { color: '#00b894' }
            }]
        };
        charts.flow.setOption(flowOption);
    }

    // 开始实时数据更新
    startRealTimeUpdate();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => {
            if (chart) chart.resize();
        });
    });
}

// 实时更新数据
function startRealTimeUpdate() {
    if (window.updateTimer) {
        clearInterval(window.updateTimer);
    }

    window.updateTimer = setInterval(() => {
        const now = new Date();
        const baseValues = getTankBaseValues(currentTankId);
        
        // 使用正弦函数生成更自然的波动
        const time = now.getTime();
        const sinValue = Math.sin(time / 10000) * 0.5;

        // 更新图表数据
        updateChartData('temperature', now, baseValues.temp + sinValue + (Math.random() - 0.5));
        updateChartData('pressure', now, baseValues.pressure + sinValue * 3 + (Math.random() - 0.5) * 2);
        updateChartData('flow', now, baseValues.flow + sinValue * 0.2 + (Math.random() - 0.5) * 0.1);
    }, 1000);
}

// 获取储氢罐基准值
function getTankBaseValues(tankId) {
    const baseValues = {
        1: { temp: 25, pressure: 350, flow: 2.5 },
        2: { temp: 26, pressure: 355, flow: 2.6 },
        3: { temp: 24, pressure: 345, flow: 2.4 },
        4: { temp: 25, pressure: 352, flow: 2.7 }
    };
    return baseValues[tankId] || baseValues[1];
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded'); // 调试日志
    
    // 初始化侧边栏菜单
    initSidebarMenus();
    
    // 初始化图表
    if (typeof echarts !== 'undefined') {
        initCharts();
        // 默认选中第一个储氢罐
        switchTank(1);
    } else {
        console.error('ECharts is not loaded');
    }
});

// 重置图表数据
function resetChartData() {
    chartData = {
        temperature: [],
        pressure: [],
        flow: []
    };
    
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.setOption({
                series: [{
                    data: []
                }]
            });
        }
    });
}

// 初始化侧边栏菜单
function initSidebarMenus() {
    document.querySelectorAll('.menu-item-wrap').forEach(wrap => {
        wrap.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuItem = this.closest('.menu-item');
            const ul = this.querySelector('ul');
            
            document.querySelectorAll('.menu-item').forEach(item => {
                if (item !== menuItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
            
            menuItem.classList.toggle('active');
        });
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded'); // 调试日志
    initSidebarMenus();
    if (typeof echarts !== 'undefined') {
        initCharts();
    } else {
        console.error('ECharts is not loaded');
    }
});

// 储氢罐记录相关功能
let tankRecords = [];

// 导入储氢罐记录
function importTankData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = handleTankFileSelect;
    input.click();
}

// 处理文件导入
function handleTankFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // 这里可以添加解析文件的具体逻辑
                const data = parseTankFile(e.target.result);
                tankRecords = tankRecords.concat(data);
                refreshTankTable();
                showNotification('储氢罐记录导入成功', 'success');
            } catch (error) {
                showNotification('文件解析失败：' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// 导出储氢罐记录
function exportTankData() {
    const data = tankRecords.map(record => ({
        shipName: record.shipName,
        tankNo: record.tankNo,
        volume: record.volume,
        ratedPressure: record.ratedPressure,
        startDate: record.startDate,
        maintenanceDate: record.maintenanceDate,
        maintenanceReason: record.maintenanceReason,
        maintenanceResult: record.maintenanceResult,
        plannedReplaceDate: record.plannedReplaceDate
    }));

    const csv = convertToCSV(data);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `储氢罐记录_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('储氢罐记录导出成功', 'success');
}

// 显示新增储氢罐记录对话框
function showAddTankDialog() {
    // 创建对话框HTML
    if (!document.getElementById('tankDialog')) {
        const dialogHTML = `
            <div id="tankDialog" class="dialog">
                <div class="dialog-content">
                    <h2><span id="dialogTitle">新增储氢罐记录</span></h2>
                    <form id="tankForm" onsubmit="handleTankSubmit(event)">
                        <!-- 基本信息 -->
                        <div class="form-section">
                            <h3>基本信息</h3>
                            <div class="form-group">
                                <label>船名：</label>
                                <input type="text" id="shipName" required>
                            </div>
                            <div class="form-group">
                                <label>储氢罐编号：</label>
                                <input type="text" id="tankNo" required>
                            </div>
                            <div class="form-group">
                                <label>容积(L)：</label>
                                <input type="number" id="volume" required min="0" step="0.1">
                            </div>
                            <div class="form-group">
                                <label>额定压力(bar)：</label>
                                <input type="number" id="ratedPressure" required min="0" step="0.1">
                            </div>
                        </div>
                        
                        <!-- 维修信息 -->
                        <div class="form-section">
                            <h3>维修信息</h3>
                            <div class="form-group">
                                <label>启用时间：</label>
                                <input type="date" id="startDate" required>
                            </div>
                            <div class="form-group">
                                <label>维修时间：</label>
                                <input type="date" id="maintenanceDate">
                            </div>
                            <div class="form-group">
                                <label>维修原因：</label>
                                <textarea id="maintenanceReason"></textarea>
                            </div>
                            <div class="form-group">
                                <label>维修结果：</label>
                                <textarea id="maintenanceResult"></textarea>
                            </div>
                            <div class="form-group">
                                <label>预计更换时间：</label>
                                <input type="date" id="plannedReplaceDate">
                            </div>
                        </div>
                        
                        <div class="dialog-buttons">
                            <button type="submit" class="submit-btn">保存</button>
                            <button type="button" class="cancel-btn" onclick="closeTankDialog()">取消</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    const dialog = document.getElementById('tankDialog');
    const form = document.getElementById('tankForm');
    
    // 重置表单
    form.reset();
    
    // 设置默认日期
    document.getElementById('startDate').value = new Date().toISOString().split('T')[0];
    
    // 显示对话框
    dialog.style.display = 'block';
    
    // 添加动画效果
    requestAnimationFrame(() => {
        dialog.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
    });
}

// 处理表单提交
function handleTankSubmit(event) {
    event.preventDefault();
    
    const formData = {
        shipName: document.getElementById('shipName').value,
        tankNo: document.getElementById('tankNo').value,
        volume: document.getElementById('volume').value,
        ratedPressure: document.getElementById('ratedPressure').value,
        startDate: document.getElementById('startDate').value,
        maintenanceDate: document.getElementById('maintenanceDate').value || '',
        maintenanceReason: document.getElementById('maintenanceReason').value || '',
        maintenanceResult: document.getElementById('maintenanceResult').value || '',
        plannedReplaceDate: document.getElementById('plannedReplaceDate').value || ''
    };

    // 添加新记录
    const newRecord = {
        id: Date.now().toString(),
        ...formData
    };
    
    tankRecords.push(newRecord);
    
    // 保存到本地存储
    saveTankRecords();
    
    // 刷新表格
    refreshTankTable();
    
    // 关闭对话框
    closeTankDialog();
    
    // 显示成功提示
    showNotification('新储氢罐记录添加成功', 'success');
}

// 关闭对话框
function closeTankDialog() {
    const dialog = document.getElementById('tankDialog');
    dialog.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        dialog.style.display = 'none';
    }, 300);
}

// 添加对话框样式
const dialogStyles = `
    .dialog {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .dialog-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 600px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: transform 0.3s ease;
    }

    .form-section {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }

    .form-section h3 {
        margin-bottom: 15px;
        color: #2c3e50;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
    }

    .form-group textarea {
        height: 80px;
        resize: vertical;
    }

    .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .submit-btn,
    .cancel-btn {
        padding: 8px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .submit-btn {
        background: #3498db;
        color: white;
    }

    .cancel-btn {
        background: #e0e0e0;
        color: #333;
    }

    .submit-btn:hover {
        background: #2980b9;
    }

    .cancel-btn:hover {
        background: #d0d0d0;
    }
`;

// 添加样式到页面
const style = document.createElement('style');
style.textContent = dialogStyles;
document.head.appendChild(style);

// 修改列表展开/收缩功能
function toggleRecordsList() {
    const content = document.querySelector('.records-content');
    const icon = document.querySelector('.collapse-icon');
    const mainContent = document.querySelector('.main-content');
    
    if (content.classList.contains('collapsed')) {
        // 展开列表
        content.classList.remove('collapsed');
        icon.style.transform = 'rotate(180deg)';
        content.style.maxHeight = '70vh'; // 设置展开后的最大高度
        content.style.transform = 'translateY(0)';
        content.style.opacity = '1';
        
        // 向上滑动覆盖效果
        content.style.position = 'absolute';
        content.style.bottom = '0';
        content.style.left = '0';
        content.style.right = '0';
        content.style.zIndex = '100';
        content.style.background = 'white';
        content.style.boxShadow = '0 -4px 20px rgba(0,0,0,0.1)';
        content.style.borderRadius = '12px 12px 0 0';
        
        // 添加模糊背景效果
        const overlay = document.createElement('div');
        overlay.className = 'records-overlay';
        mainContent.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 0);
    } else {
        // 收起列表
        content.classList.add('collapsed');
        icon.style.transform = 'rotate(0deg)';
        content.style.maxHeight = '0';
        content.style.transform = 'translateY(100%)';
        content.style.opacity = '0';
        
        // 移除模糊背景
        const overlay = document.querySelector('.records-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
}

// 添加相应的CSS样式
const recordsStyles = `
    .records-content {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
        padding: 20px;
        overflow: hidden;
    }

    .records-content.collapsed {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        transform: translateY(100%);
        opacity: 0;
    }

    .records-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 99;
    }

    .table-scroll-container {
        max-height: calc(70vh - 100px);
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }

    /* 美化滚动条 */
    .table-scroll-container::-webkit-scrollbar {
        width: 8px;
    }

    .table-scroll-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    .table-scroll-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }

    .table-scroll-container::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    /* 动画过渡效果 */
    .collapse-icon {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 表格容器动画 */
    .tank-table {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }

    .records-content:not(.collapsed) .tank-table {
        opacity: 1;
        transform: translateY(0);
    }
`;

// 添加样式到页面
const styleElement = document.createElement('style');
styleElement.textContent = recordsStyles;
document.head.appendChild(styleElement);

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 默认收起列表
    const content = document.querySelector('.records-content');
    if (content) {
        content.classList.add('collapsed');
    }
    
    // 点击背景关闭列表
    document.addEventListener('click', function(e) {
        const overlay = document.querySelector('.records-overlay');
        if (overlay && e.target === overlay) {
            toggleRecordsList();
        }
    });
});

// 侧边栏菜单功能
function initSidebar() {
    // 为每个菜单项的h2标题添加点击事件
    document.querySelectorAll('.sidebar .menu-item').forEach(menuItem => {
        const title = menuItem.querySelector('h2');
        const ul = menuItem.querySelector('ul');
        
        if (title && ul) {
            title.addEventListener('click', () => {
                // 获取当前菜单的ID
                const menuId = ul.id;
                
                // 关闭其他菜单
                document.querySelectorAll('.sidebar .menu-item').forEach(item => {
                    if (item !== menuItem && item.classList.contains('active')) {
                        item.classList.remove('active');
                        const otherUl = item.querySelector('ul');
                        if (otherUl) {
                            otherUl.style.maxHeight = '0';
                            otherUl.style.opacity = '0';
                        }
                    }
                });
                
                // 切换当前菜单
                menuItem.classList.toggle('active');
                if (menuItem.classList.contains('active')) {
                    ul.style.maxHeight = ul.scrollHeight + 'px';
                    ul.style.opacity = '1';
                } else {
                    ul.style.maxHeight = '0';
                    ul.style.opacity = '0';
                }
            });
        }
    });
}

// 页面加载时初始化侧边栏
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    
    // 根据当前页面URL激活对应的菜单项
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar .menu-item ul li').forEach(li => {
        const link = li.getAttribute('onclick');
        if (link && link.includes(currentPage)) {
            const menuItem = li.closest('.menu-item');
            if (menuItem) {
                menuItem.classList.add('active');
                const ul = menuItem.querySelector('ul');
                if (ul) {
                    ul.style.maxHeight = ul.scrollHeight + 'px';
                    ul.style.opacity = '1';
                }
            }
        }
    });
});

// 添加页面切换动画
function smoothPageTransition(url) {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// 修改所有页面链接的点击事件
document.querySelectorAll('.sidebar li').forEach(li => {
    const originalOnclick = li.getAttribute('onclick');
    if (originalOnclick && originalOnclick.includes('window.location.href')) {
        const url = originalOnclick.match(/'(.+?)'/)[1];
        li.removeAttribute('onclick');
        li.addEventListener('click', (e) => {
            e.preventDefault();
            smoothPageTransition(url);
        });
    }
}); 