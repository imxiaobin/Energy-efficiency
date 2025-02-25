const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const activeMenu = ref('');
        const activeMenuItem = ref('');
        const alarmData = ref([
            {
                time: '2024-03-15 10:30:00',
                type: '氢气压力异常',
                description: '系统压力超过预警阈值 3.0 MPa',
                status: '处理中'
            },
            {
                time: '2024-03-15 09:15:00',
                type: '能效预警',
                description: '当前航速下能耗偏高，建议调整航速',
                status: '已处理'
            },
            {
                time: '2024-03-15 08:00:00',
                type: '系统维护提醒',
                description: '燃料电池堆需要定期检查维护',
                status: '未处理'
            }
        ]);

        // 菜单项点击处理函数
        const handleMenuClick = (menuId) => {
            activeMenu.value = menuId;
            // 移除所有菜单项的active类
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            // 为当前点击的菜单项添加active类
            document.getElementById(menuId).classList.add('active');
        };

        // 子菜单项点击处理函数
        const handleSubMenuClick = (menuId, itemName) => {
            activeMenuItem.value = itemName;
            handleMenuClick(menuId);

            // 根据不同的菜单项跳转到相应的页面
            const pages = {
                // 船舶信息
                '船舶基本信息': '船舶基本信息.html',
                '船舶证书信息': '船舶证书信息.html',
                '船舶检验信息': '船舶检验信息.html',
                '船舶设备信息': '船舶设备信息.html',
                
                // 航行记录
                '航次记录': '航次记录.html',
                '日报记录': '日报记录.html',
                '加氢记录': '加氢记录.html',
                '储氢罐记录': '储氢罐记录.html',
                '能耗记录表': '能耗记录表.html',
                
                // 在线监测
                '实时监测数据': '实时监测数据.html',
                '历史监测数据': '历史监测数据.html',
                '监测点管理': '监测点管理.html',
                '报警记录': '报警记录.html',
                
                // 能效优化
                '航速优化': '船舶航速优化.html',
                '航线优化': '船舶航线优化.html',
                '纵倾优化': '船舶纵倾优化.html',
                '能效评估': '能效评估.html',
                
                // 人员管理
                '船员信息': '在职人员信息.html',
                '值班安排': '值班安排.html',
                '培训记录': '培训记录.html',
                
                // 维护保养
                '维护计划': '维护计划.html',
                '维护记录': '维护记录.html',
                '备件管理': '备件管理.html',
                '维修记录': '维修记录.html',
                
                // 报表管理
                '能效报告': '能效报告.html',
                '维护报告': '维护报告.html',
                '航行报告': '航行报告.html',
                '检验报告': '检验报告.html'
            };

            if (pages[itemName]) {
                window.location.href = pages[itemName];
            }
        };

        // 初始化能耗统计图表
        const initEnergyChart = () => {
            const chartDom = document.getElementById('energy-chart');
            const myChart = echarts.init(chartDom);
            const option = {
                title: {
                    text: '24小时能耗趋势',
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        return params[0].name + '<br/>' +
                               '能耗: ' + params[0].value + ' kg/h<br/>' +
                               '航速: ' + params[1].value + ' 节';
                    }
                },
                legend: {
                    data: ['氢耗率', '航速'],
                    right: 10,
                    top: 0
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', 
                          '14:00', '16:00', '18:00', '20:00', '22:00', '现在'],
                    axisLabel: {
                        rotate: 0
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '能耗 (kg/h)',
                        position: 'left',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#3498db'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '航速 (节)',
                        position: 'right',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#e74c3c'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '氢耗率',
                        type: 'line',
                        smooth: true,
                        data: [2.1, 2.3, 2.0, 2.5, 2.8, 2.4, 2.7, 2.3, 2.6, 2.4, 2.5, 2.3, 2.4],
                        itemStyle: {
                            color: '#3498db'
                        },
                        areaStyle: {
                            opacity: 0.1
                        }
                    },
                    {
                        name: '航速',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 1,
                        data: [14, 14.5, 13.8, 15.2, 16.0, 15.5, 15.8, 15.2, 15.5, 15.3, 15.4, 15.2, 15.5],
                        itemStyle: {
                            color: '#e74c3c'
                        }
                    }
                ]
            };
            myChart.setOption(option);
            
            window.addEventListener('resize', () => {
                myChart.resize();
            });
        };

        onMounted(() => {
            initEnergyChart();

            // 为所有菜单项添加点击事件监听器
            document.querySelectorAll('.menu-item h2').forEach(header => {
                header.addEventListener('click', () => {
                    const menuId = header.parentElement.id;
                    handleMenuClick(menuId);
                });
            });

            // 为所有子菜单项添加点击事件监听器
            document.querySelectorAll('.menu-item li').forEach(item => {
                item.addEventListener('click', () => {
                    const menuId = item.closest('.menu-item').id;
                    const itemName = item.textContent.trim();
                    handleSubMenuClick(menuId, itemName);
                });
            });
        });

        return {
            activeMenu,
            activeMenuItem,
            alarmData,
            handleMenuClick,
            handleSubMenuClick
        };
    }
});

app.use(ElementPlus);
app.mount('#app'); 