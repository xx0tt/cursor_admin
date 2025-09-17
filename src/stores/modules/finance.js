import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 财务状态管理
 * 管理收入、支出、财务报表等财务相关数据和操作
 */
export const useFinanceStore = defineStore('finance', () => {
  // 状态定义
  const revenueRecords = ref([]) // 收入记录
  const expenseRecords = ref([]) // 支出记录
  const financeLoading = ref(false) // 财务数据加载状态
  const financeStatistics = ref({
    totalRevenue: 0, // 总收入
    totalExpense: 0, // 总支出
    netProfit: 0, // 净利润
    monthlyRevenue: 0, // 月收入
    monthlyExpense: 0, // 月支出
    monthlyProfit: 0 // 月利润
  })

  // 收入类型枚举
  const REVENUE_TYPE = {
    RENTAL: 'rental', // 租赁收入
    DEPOSIT: 'deposit', // 押金
    SERVICE: 'service', // 服务费
    PENALTY: 'penalty', // 违约金
    OTHER: 'other' // 其他收入
  }

  // 支出类型枚举
  const EXPENSE_TYPE = {
    PURCHASE: 'purchase', // 设备采购
    MAINTENANCE: 'maintenance', // 维护费用
    SALARY: 'salary', // 人员工资
    RENT: 'rent', // 场地租金
    INSURANCE: 'insurance', // 保险费用
    FUEL: 'fuel', // 燃油费用
    LOGISTICS: 'logistics', // 物流费用
    OTHER: 'other' // 其他支出
  }

  // 收入类型标签映射
  const REVENUE_TYPE_LABELS = {
    [REVENUE_TYPE.RENTAL]: '租赁收入',
    [REVENUE_TYPE.DEPOSIT]: '押金',
    [REVENUE_TYPE.SERVICE]: '服务费',
    [REVENUE_TYPE.PENALTY]: '违约金',
    [REVENUE_TYPE.OTHER]: '其他收入'
  }

  // 支出类型标签映射
  const EXPENSE_TYPE_LABELS = {
    [EXPENSE_TYPE.PURCHASE]: '设备采购',
    [EXPENSE_TYPE.MAINTENANCE]: '维护费用',
    [EXPENSE_TYPE.SALARY]: '人员工资',
    [EXPENSE_TYPE.RENT]: '场地租金',
    [EXPENSE_TYPE.INSURANCE]: '保险费用',
    [EXPENSE_TYPE.FUEL]: '燃油费用',
    [EXPENSE_TYPE.LOGISTICS]: '物流费用',
    [EXPENSE_TYPE.OTHER]: '其他支出'
  }

  // 计算属性
  const totalRevenue = computed(() => {
    return revenueRecords.value.reduce((total, record) => total + record.amount, 0)
  })

  const totalExpense = computed(() => {
    return expenseRecords.value.reduce((total, record) => total + record.amount, 0)
  })

  const netProfit = computed(() => {
    return totalRevenue.value - totalExpense.value
  })

  // 当月收入
  const monthlyRevenue = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return revenueRecords.value
      .filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
      })
      .reduce((total, record) => total + record.amount, 0)
  })

  // 当月支出
  const monthlyExpense = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return expenseRecords.value
      .filter(record => {
        const recordDate = new Date(record.date)
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
      })
      .reduce((total, record) => total + record.amount, 0)
  })

  // 当月利润
  const monthlyProfit = computed(() => {
    return monthlyRevenue.value - monthlyExpense.value
  })

  /**
   * 获取收入记录
   * @param {Object} params - 查询参数
   */
  const fetchRevenueRecords = async (params = {}) => {
    financeLoading.value = true
    try {
      // 这里应该调用API获取收入记录
      // const response = await api.getRevenueRecords(params)
      
      // 模拟API响应
      const mockRevenue = generateMockRevenueRecords()
      revenueRecords.value = mockRevenue
      
      // 更新统计数据
      updateFinanceStatistics()
      
      return mockRevenue
    } catch (error) {
      console.error('获取收入记录失败:', error)
      throw error
    } finally {
      financeLoading.value = false
    }
  }

  /**
   * 获取支出记录
   * @param {Object} params - 查询参数
   */
  const fetchExpenseRecords = async (params = {}) => {
    financeLoading.value = true
    try {
      // 这里应该调用API获取支出记录
      // const response = await api.getExpenseRecords(params)
      
      // 模拟API响应
      const mockExpense = generateMockExpenseRecords()
      expenseRecords.value = mockExpense
      
      // 更新统计数据
      updateFinanceStatistics()
      
      return mockExpense
    } catch (error) {
      console.error('获取支出记录失败:', error)
      throw error
    } finally {
      financeLoading.value = false
    }
  }

  /**
   * 创建收入记录
   * @param {Object} revenueData - 收入数据
   */
  const createRevenueRecord = async (revenueData) => {
    try {
      // 这里应该调用API创建收入记录
      // const response = await api.createRevenueRecord(revenueData)
      
      // 模拟创建收入记录
      const newRecord = {
        id: `REV-${Date.now()}`,
        ...revenueData,
        createTime: new Date(),
        status: 'confirmed'
      }
      
      revenueRecords.value.unshift(newRecord)
      updateFinanceStatistics()
      
      return newRecord
    } catch (error) {
      console.error('创建收入记录失败:', error)
      throw error
    }
  }

  /**
   * 创建支出记录
   * @param {Object} expenseData - 支出数据
   */
  const createExpenseRecord = async (expenseData) => {
    try {
      // 这里应该调用API创建支出记录
      // const response = await api.createExpenseRecord(expenseData)
      
      // 模拟创建支出记录
      const newRecord = {
        id: `EXP-${Date.now()}`,
        ...expenseData,
        createTime: new Date(),
        status: 'confirmed'
      }
      
      expenseRecords.value.unshift(newRecord)
      updateFinanceStatistics()
      
      return newRecord
    } catch (error) {
      console.error('创建支出记录失败:', error)
      throw error
    }
  }

  /**
   * 获取财务报表数据
   * @param {Object} params - 查询参数
   */
  const getFinancialReport = async (params = {}) => {
    try {
      const { startDate, endDate, type = 'monthly' } = params
      
      // 过滤指定时间范围的数据
      const filteredRevenue = revenueRecords.value.filter(record => {
        const recordDate = new Date(record.date)
        return (!startDate || recordDate >= new Date(startDate)) &&
               (!endDate || recordDate <= new Date(endDate))
      })
      
      const filteredExpense = expenseRecords.value.filter(record => {
        const recordDate = new Date(record.date)
        return (!startDate || recordDate >= new Date(startDate)) &&
               (!endDate || recordDate <= new Date(endDate))
      })
      
      // 按类型分组统计
      const revenueByType = {}
      const expenseByType = {}
      
      filteredRevenue.forEach(record => {
        if (!revenueByType[record.type]) {
          revenueByType[record.type] = 0
        }
        revenueByType[record.type] += record.amount
      })
      
      filteredExpense.forEach(record => {
        if (!expenseByType[record.type]) {
          expenseByType[record.type] = 0
        }
        expenseByType[record.type] += record.amount
      })
      
      // 按时间分组统计（用于图表展示）
      const timeSeriesData = generateTimeSeriesData(filteredRevenue, filteredExpense, type)
      
      return {
        summary: {
          totalRevenue: filteredRevenue.reduce((sum, record) => sum + record.amount, 0),
          totalExpense: filteredExpense.reduce((sum, record) => sum + record.amount, 0),
          netProfit: filteredRevenue.reduce((sum, record) => sum + record.amount, 0) - 
                    filteredExpense.reduce((sum, record) => sum + record.amount, 0),
          recordCount: filteredRevenue.length + filteredExpense.length
        },
        revenueByType,
        expenseByType,
        timeSeriesData,
        revenueRecords: filteredRevenue,
        expenseRecords: filteredExpense
      }
    } catch (error) {
      console.error('获取财务报表失败:', error)
      throw error
    }
  }

  /**
   * 生成时间序列数据
   * @param {Array} revenueData - 收入数据
   * @param {Array} expenseData - 支出数据
   * @param {string} type - 时间类型：daily/weekly/monthly/yearly
   */
  const generateTimeSeriesData = (revenueData, expenseData, type) => {
    const timeMap = new Map()
    
    // 处理收入数据
    revenueData.forEach(record => {
      const key = formatDateByType(new Date(record.date), type)
      if (!timeMap.has(key)) {
        timeMap.set(key, { revenue: 0, expense: 0, profit: 0 })
      }
      timeMap.get(key).revenue += record.amount
    })
    
    // 处理支出数据
    expenseData.forEach(record => {
      const key = formatDateByType(new Date(record.date), type)
      if (!timeMap.has(key)) {
        timeMap.set(key, { revenue: 0, expense: 0, profit: 0 })
      }
      timeMap.get(key).expense += record.amount
    })
    
    // 计算利润
    timeMap.forEach((value, key) => {
      value.profit = value.revenue - value.expense
    })
    
    // 转换为数组并排序
    return Array.from(timeMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  /**
   * 根据类型格式化日期
   * @param {Date} date - 日期对象
   * @param {string} type - 类型
   */
  const formatDateByType = (date, type) => {
    switch (type) {
      case 'daily':
        return date.toISOString().split('T')[0]
      case 'weekly':
        const week = getWeekNumber(date)
        return `${date.getFullYear()}-W${week}`
      case 'monthly':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      case 'yearly':
        return String(date.getFullYear())
      default:
        return date.toISOString().split('T')[0]
    }
  }

  /**
   * 获取周数
   * @param {Date} date - 日期对象
   */
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  /**
   * 更新财务统计数据
   */
  const updateFinanceStatistics = () => {
    financeStatistics.value = {
      totalRevenue: totalRevenue.value,
      totalExpense: totalExpense.value,
      netProfit: netProfit.value,
      monthlyRevenue: monthlyRevenue.value,
      monthlyExpense: monthlyExpense.value,
      monthlyProfit: monthlyProfit.value
    }
  }

  /**
   * 生成模拟收入记录
   */
  const generateMockRevenueRecords = () => {
    const mockData = []
    const types = Object.values(REVENUE_TYPE)
    const customers = ['建设集团有限公司', '市政工程公司', '房地产开发公司', '基建工程公司']
    
    for (let i = 1; i <= 100; i++) {
      const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const type = types[Math.floor(Math.random() * types.length)]
      let amount = 0
      
      switch (type) {
        case REVENUE_TYPE.RENTAL:
          amount = Math.floor(Math.random() * 50000) + 10000
          break
        case REVENUE_TYPE.DEPOSIT:
          amount = Math.floor(Math.random() * 20000) + 5000
          break
        case REVENUE_TYPE.SERVICE:
          amount = Math.floor(Math.random() * 5000) + 1000
          break
        case REVENUE_TYPE.PENALTY:
          amount = Math.floor(Math.random() * 10000) + 2000
          break
        case REVENUE_TYPE.OTHER:
          amount = Math.floor(Math.random() * 8000) + 1000
          break
      }
      
      mockData.push({
        id: `REV-2024-${String(i).padStart(3, '0')}`,
        type,
        amount,
        date,
        customer: customers[Math.floor(Math.random() * customers.length)],
        orderId: type === REVENUE_TYPE.RENTAL ? `ORD-2024-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}` : null,
        description: `${REVENUE_TYPE_LABELS[type]} - ${new Date(date).toLocaleDateString()}`,
        paymentMethod: ['现金', '银行转账', '支票', '在线支付'][Math.floor(Math.random() * 4)],
        status: ['pending', 'confirmed', 'cancelled'][Math.floor(Math.random() * 3)],
        createTime: date,
        remark: ''
      })
    }
    
    return mockData.sort((a, b) => b.date - a.date)
  }

  /**
   * 生成模拟支出记录
   */
  const generateMockExpenseRecords = () => {
    const mockData = []
    const types = Object.values(EXPENSE_TYPE)
    const vendors = ['供应商A', '供应商B', '供应商C', '服务商X', '服务商Y']
    
    for (let i = 1; i <= 80; i++) {
      const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const type = types[Math.floor(Math.random() * types.length)]
      let amount = 0
      
      switch (type) {
        case EXPENSE_TYPE.PURCHASE:
          amount = Math.floor(Math.random() * 200000) + 50000
          break
        case EXPENSE_TYPE.MAINTENANCE:
          amount = Math.floor(Math.random() * 10000) + 2000
          break
        case EXPENSE_TYPE.SALARY:
          amount = Math.floor(Math.random() * 20000) + 8000
          break
        case EXPENSE_TYPE.RENT:
          amount = Math.floor(Math.random() * 15000) + 5000
          break
        case EXPENSE_TYPE.INSURANCE:
          amount = Math.floor(Math.random() * 8000) + 2000
          break
        case EXPENSE_TYPE.FUEL:
          amount = Math.floor(Math.random() * 5000) + 1000
          break
        case EXPENSE_TYPE.LOGISTICS:
          amount = Math.floor(Math.random() * 3000) + 500
          break
        case EXPENSE_TYPE.OTHER:
          amount = Math.floor(Math.random() * 5000) + 500
          break
      }
      
      mockData.push({
        id: `EXP-2024-${String(i).padStart(3, '0')}`,
        type,
        amount,
        date,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        description: `${EXPENSE_TYPE_LABELS[type]} - ${new Date(date).toLocaleDateString()}`,
        paymentMethod: ['现金', '银行转账', '支票', '在线支付'][Math.floor(Math.random() * 4)],
        status: ['pending', 'confirmed', 'cancelled'][Math.floor(Math.random() * 3)],
        createTime: date,
        remark: ''
      })
    }
    
    return mockData.sort((a, b) => b.date - a.date)
  }

  /**
   * 清空财务数据
   */
  const clearFinanceData = () => {
    revenueRecords.value = []
    expenseRecords.value = []
    financeStatistics.value = {
      totalRevenue: 0,
      totalExpense: 0,
      netProfit: 0,
      monthlyRevenue: 0,
      monthlyExpense: 0,
      monthlyProfit: 0
    }
  }

  return {
    // 状态
    revenueRecords,
    expenseRecords,
    financeLoading,
    financeStatistics,
    
    // 常量
    REVENUE_TYPE,
    EXPENSE_TYPE,
    REVENUE_TYPE_LABELS,
    EXPENSE_TYPE_LABELS,
    
    // 计算属性
    totalRevenue,
    totalExpense,
    netProfit,
    monthlyRevenue,
    monthlyExpense,
    monthlyProfit,
    
    // 方法
    fetchRevenueRecords,
    fetchExpenseRecords,
    createRevenueRecord,
    createExpenseRecord,
    getFinancialReport,
    clearFinanceData
  }
})
