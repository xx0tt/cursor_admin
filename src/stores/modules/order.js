import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 订单状态管理
 * 管理订单相关的数据和操作
 */
export const useOrderStore = defineStore('order', () => {
  // 状态定义
  const orders = ref([]) // 订单列表
  const currentOrder = ref(null) // 当前选中的订单
  const orderLoading = ref(false) // 订单加载状态
  const orderStatistics = ref({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  })

  // 订单状态枚举
  const ORDER_STATUS = {
    PENDING: 'pending', // 待确认
    CONFIRMED: 'confirmed', // 已确认
    IN_PROGRESS: 'in_progress', // 进行中
    COMPLETED: 'completed', // 已完成
    CANCELLED: 'cancelled' // 已取消
  }

  // 订单状态标签映射
  const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: '待确认',
    [ORDER_STATUS.CONFIRMED]: '已确认',
    [ORDER_STATUS.IN_PROGRESS]: '进行中',
    [ORDER_STATUS.COMPLETED]: '已完成',
    [ORDER_STATUS.CANCELLED]: '已取消'
  }

  // 订单状态标签类型映射
  const ORDER_STATUS_TYPES = {
    [ORDER_STATUS.PENDING]: 'warning',
    [ORDER_STATUS.CONFIRMED]: 'primary',
    [ORDER_STATUS.IN_PROGRESS]: 'success',
    [ORDER_STATUS.COMPLETED]: 'success',
    [ORDER_STATUS.CANCELLED]: 'danger'
  }

  // 计算属性
  const orderCount = computed(() => orders.value.length)
  const pendingOrders = computed(() => 
    orders.value.filter(order => order.status === ORDER_STATUS.PENDING)
  )
  const activeOrders = computed(() => 
    orders.value.filter(order => 
      [ORDER_STATUS.CONFIRMED, ORDER_STATUS.IN_PROGRESS].includes(order.status)
    )
  )

  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   */
  const fetchOrders = async (params = {}) => {
    orderLoading.value = true
    try {
      // 这里应该调用API获取订单列表
      // const response = await api.getOrders(params)
      
      // 模拟API响应
      const mockOrders = generateMockOrders()
      orders.value = mockOrders
      
      // 更新统计数据
      updateOrderStatistics()
      
      return mockOrders
    } catch (error) {
      console.error('获取订单列表失败:', error)
      throw error
    } finally {
      orderLoading.value = false
    }
  }

  /**
   * 获取订单详情
   * @param {string|number} orderId - 订单ID
   */
  const fetchOrderDetail = async (orderId) => {
    orderLoading.value = true
    try {
      // 这里应该调用API获取订单详情
      // const response = await api.getOrderDetail(orderId)
      
      // 模拟获取订单详情
      const order = orders.value.find(o => o.id === orderId) || 
                   generateMockOrderDetail(orderId)
      
      currentOrder.value = order
      return order
    } catch (error) {
      console.error('获取订单详情失败:', error)
      throw error
    } finally {
      orderLoading.value = false
    }
  }

  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   */
  const createOrder = async (orderData) => {
    try {
      // 这里应该调用API创建订单
      // const response = await api.createOrder(orderData)
      
      // 模拟创建订单
      const newOrder = {
        id: `ORD-${Date.now()}`,
        ...orderData,
        status: ORDER_STATUS.PENDING,
        createTime: new Date(),
        updateTime: new Date()
      }
      
      orders.value.unshift(newOrder)
      updateOrderStatistics()
      
      return newOrder
    } catch (error) {
      console.error('创建订单失败:', error)
      throw error
    }
  }

  /**
   * 更新订单
   * @param {string|number} orderId - 订单ID
   * @param {Object} updateData - 更新数据
   */
  const updateOrder = async (orderId, updateData) => {
    try {
      // 这里应该调用API更新订单
      // const response = await api.updateOrder(orderId, updateData)
      
      // 模拟更新订单
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          ...updateData,
          updateTime: new Date()
        }
        
        // 如果是当前订单，也要更新
        if (currentOrder.value && currentOrder.value.id === orderId) {
          currentOrder.value = orders.value[index]
        }
      }
      
      updateOrderStatistics()
      return orders.value[index]
    } catch (error) {
      console.error('更新订单失败:', error)
      throw error
    }
  }

  /**
   * 更新订单状态
   * @param {string|number} orderId - 订单ID
   * @param {string} status - 新状态
   * @param {string} remark - 备注
   */
  const updateOrderStatus = async (orderId, status, remark = '') => {
    try {
      const updateData = {
        status,
        remark,
        statusUpdateTime: new Date()
      }
      
      return await updateOrder(orderId, updateData)
    } catch (error) {
      console.error('更新订单状态失败:', error)
      throw error
    }
  }

  /**
   * 删除订单
   * @param {string|number} orderId - 订单ID
   */
  const deleteOrder = async (orderId) => {
    try {
      // 这里应该调用API删除订单
      // await api.deleteOrder(orderId)
      
      // 从列表中移除
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value.splice(index, 1)
      }
      
      // 如果删除的是当前订单，清空当前订单
      if (currentOrder.value && currentOrder.value.id === orderId) {
        currentOrder.value = null
      }
      
      updateOrderStatistics()
      return true
    } catch (error) {
      console.error('删除订单失败:', error)
      throw error
    }
  }

  /**
   * 更新订单统计数据
   */
  const updateOrderStatistics = () => {
    const stats = {
      total: orders.value.length,
      pending: 0,
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    }
    
    orders.value.forEach(order => {
      switch (order.status) {
        case ORDER_STATUS.PENDING:
          stats.pending++
          break
        case ORDER_STATUS.CONFIRMED:
          stats.confirmed++
          break
        case ORDER_STATUS.IN_PROGRESS:
          stats.inProgress++
          break
        case ORDER_STATUS.COMPLETED:
          stats.completed++
          break
        case ORDER_STATUS.CANCELLED:
          stats.cancelled++
          break
      }
    })
    
    orderStatistics.value = stats
  }

  /**
   * 生成模拟订单数据
   */
  const generateMockOrders = () => {
    const mockData = []
    const statuses = Object.values(ORDER_STATUS)
    const equipmentTypes = ['挖掘机', '装载机', '推土机', '压路机', '起重机', '搅拌车']
    const customers = ['建设集团有限公司', '市政工程公司', '房地产开发公司', '基建工程公司', '交通建设公司']
    
    for (let i = 1; i <= 50; i++) {
      const createTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      mockData.push({
        id: `ORD-2024-${String(i).padStart(3, '0')}`,
        orderNo: `ORD-2024-${String(i).padStart(3, '0')}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        customerPhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        equipmentType: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
        equipmentModel: `${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]}-${Math.floor(Math.random() * 1000)}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: Math.floor(Math.random() * 1000) + 500,
        totalAmount: 0, // 会在下面计算
        rentStartDate: createTime,
        rentEndDate: new Date(createTime.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000),
        status,
        createTime,
        updateTime: new Date(createTime.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        remark: status === ORDER_STATUS.CANCELLED ? '客户取消订单' : '',
        address: '上海市浦东新区张江高科技园区',
        contact: '张先生'
      })
    }
    
    // 计算总金额
    mockData.forEach(order => {
      const days = Math.ceil((order.rentEndDate - order.rentStartDate) / (1000 * 60 * 60 * 24))
      order.totalAmount = order.quantity * order.unitPrice * days
    })
    
    return mockData.sort((a, b) => b.createTime - a.createTime)
  }

  /**
   * 生成模拟订单详情
   */
  const generateMockOrderDetail = (orderId) => {
    return {
      id: orderId,
      orderNo: orderId,
      customerName: '建设集团有限公司',
      customerPhone: '13800138000',
      equipmentType: '挖掘机',
      equipmentModel: '挖掘机-CAT320D',
      quantity: 2,
      unitPrice: 800,
      totalAmount: 12800,
      rentStartDate: new Date(),
      rentEndDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      status: ORDER_STATUS.CONFIRMED,
      createTime: new Date(),
      updateTime: new Date(),
      remark: '',
      address: '上海市浦东新区张江高科技园区',
      contact: '张先生',
      // 详细信息
      equipmentDetails: [
        {
          id: 'EQ001',
          name: '挖掘机CAT320D',
          serialNumber: 'CAT320D001',
          status: '租赁中'
        },
        {
          id: 'EQ002',
          name: '挖掘机CAT320D',
          serialNumber: 'CAT320D002',
          status: '租赁中'
        }
      ],
      timeline: [
        {
          time: new Date(),
          status: '订单创建',
          operator: '系统',
          remark: '客户提交租赁申请'
        },
        {
          time: new Date(Date.now() - 60 * 60 * 1000),
          status: '订单确认',
          operator: '张三',
          remark: '审核通过，订单确认'
        }
      ]
    }
  }

  /**
   * 清空订单数据
   */
  const clearOrders = () => {
    orders.value = []
    currentOrder.value = null
    orderStatistics.value = {
      total: 0,
      pending: 0,
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    }
  }

  return {
    // 状态
    orders,
    currentOrder,
    orderLoading,
    orderStatistics,
    
    // 常量
    ORDER_STATUS,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_TYPES,
    
    // 计算属性
    orderCount,
    pendingOrders,
    activeOrders,
    
    // 方法
    fetchOrders,
    fetchOrderDetail,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    clearOrders
  }
})
