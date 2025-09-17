import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 仓储状态管理
 * 管理库存、出入库等仓储相关数据和操作
 */
export const useWarehouseStore = defineStore('warehouse', () => {
  // 状态定义
  const inventoryList = ref([]) // 库存列表
  const warehouseList = ref([]) // 仓库列表
  const inboundRecords = ref([]) // 入库记录
  const outboundRecords = ref([]) // 出库记录
  const warehouseLoading = ref(false) // 加载状态
  const inventoryStatistics = ref({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  })

  // 库存状态枚举
  const STOCK_STATUS = {
    IN_STOCK: 'in_stock', // 有库存
    LOW_STOCK: 'low_stock', // 低库存
    OUT_OF_STOCK: 'out_of_stock' // 缺货
  }

  // 出入库类型枚举
  const WAREHOUSE_OPERATION_TYPE = {
    INBOUND: 'inbound', // 入库
    OUTBOUND: 'outbound', // 出库
    TRANSFER: 'transfer', // 调拨
    RETURN: 'return', // 退货
    LOSS: 'loss', // 损耗
    ADJUSTMENT: 'adjustment' // 调整
  }

  // 操作类型标签映射
  const OPERATION_TYPE_LABELS = {
    [WAREHOUSE_OPERATION_TYPE.INBOUND]: '入库',
    [WAREHOUSE_OPERATION_TYPE.OUTBOUND]: '出库',
    [WAREHOUSE_OPERATION_TYPE.TRANSFER]: '调拨',
    [WAREHOUSE_OPERATION_TYPE.RETURN]: '退货',
    [WAREHOUSE_OPERATION_TYPE.LOSS]: '损耗',
    [WAREHOUSE_OPERATION_TYPE.ADJUSTMENT]: '调整'
  }

  // 操作类型标签颜色映射
  const OPERATION_TYPE_COLORS = {
    [WAREHOUSE_OPERATION_TYPE.INBOUND]: 'success',
    [WAREHOUSE_OPERATION_TYPE.OUTBOUND]: 'warning',
    [WAREHOUSE_OPERATION_TYPE.TRANSFER]: 'primary',
    [WAREHOUSE_OPERATION_TYPE.RETURN]: 'info',
    [WAREHOUSE_OPERATION_TYPE.LOSS]: 'danger',
    [WAREHOUSE_OPERATION_TYPE.ADJUSTMENT]: 'default'
  }

  // 计算属性
  const totalInventoryValue = computed(() => {
    return inventoryList.value.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice)
    }, 0)
  })

  const lowStockItems = computed(() => {
    return inventoryList.value.filter(item => 
      item.quantity <= item.minStock && item.quantity > 0
    )
  })

  const outOfStockItems = computed(() => {
    return inventoryList.value.filter(item => item.quantity === 0)
  })

  /**
   * 获取库存列表
   * @param {Object} params - 查询参数
   */
  const fetchInventoryList = async (params = {}) => {
    warehouseLoading.value = true
    try {
      // 这里应该调用API获取库存列表
      // const response = await api.getInventoryList(params)
      
      // 模拟API响应
      const mockInventory = generateMockInventory()
      inventoryList.value = mockInventory
      
      // 更新统计数据
      updateInventoryStatistics()
      
      return mockInventory
    } catch (error) {
      console.error('获取库存列表失败:', error)
      throw error
    } finally {
      warehouseLoading.value = false
    }
  }

  /**
   * 获取仓库列表
   */
  const fetchWarehouseList = async () => {
    try {
      // 这里应该调用API获取仓库列表
      // const response = await api.getWarehouseList()
      
      // 模拟API响应
      const mockWarehouses = generateMockWarehouses()
      warehouseList.value = mockWarehouses
      
      return mockWarehouses
    } catch (error) {
      console.error('获取仓库列表失败:', error)
      throw error
    }
  }

  /**
   * 获取入库记录
   * @param {Object} params - 查询参数
   */
  const fetchInboundRecords = async (params = {}) => {
    warehouseLoading.value = true
    try {
      // 这里应该调用API获取入库记录
      // const response = await api.getInboundRecords(params)
      
      // 模拟API响应
      const mockRecords = generateMockInboundRecords()
      inboundRecords.value = mockRecords
      
      return mockRecords
    } catch (error) {
      console.error('获取入库记录失败:', error)
      throw error
    } finally {
      warehouseLoading.value = false
    }
  }

  /**
   * 获取出库记录
   * @param {Object} params - 查询参数
   */
  const fetchOutboundRecords = async (params = {}) => {
    warehouseLoading.value = true
    try {
      // 这里应该调用API获取出库记录
      // const response = await api.getOutboundRecords(params)
      
      // 模拟API响应
      const mockRecords = generateMockOutboundRecords()
      outboundRecords.value = mockRecords
      
      return mockRecords
    } catch (error) {
      console.error('获取出库记录失败:', error)
      throw error
    } finally {
      warehouseLoading.value = false
    }
  }

  /**
   * 创建入库记录
   * @param {Object} inboundData - 入库数据
   */
  const createInboundRecord = async (inboundData) => {
    try {
      // 这里应该调用API创建入库记录
      // const response = await api.createInboundRecord(inboundData)
      
      // 模拟创建入库记录
      const newRecord = {
        id: `IN-${Date.now()}`,
        ...inboundData,
        type: WAREHOUSE_OPERATION_TYPE.INBOUND,
        createTime: new Date(),
        status: 'completed'
      }
      
      inboundRecords.value.unshift(newRecord)
      
      // 更新库存
      updateInventoryQuantity(inboundData.itemId, inboundData.quantity, 'add')
      
      return newRecord
    } catch (error) {
      console.error('创建入库记录失败:', error)
      throw error
    }
  }

  /**
   * 创建出库记录
   * @param {Object} outboundData - 出库数据
   */
  const createOutboundRecord = async (outboundData) => {
    try {
      // 这里应该调用API创建出库记录
      // const response = await api.createOutboundRecord(outboundData)
      
      // 模拟创建出库记录
      const newRecord = {
        id: `OUT-${Date.now()}`,
        ...outboundData,
        type: WAREHOUSE_OPERATION_TYPE.OUTBOUND,
        createTime: new Date(),
        status: 'completed'
      }
      
      outboundRecords.value.unshift(newRecord)
      
      // 更新库存
      updateInventoryQuantity(outboundData.itemId, outboundData.quantity, 'subtract')
      
      return newRecord
    } catch (error) {
      console.error('创建出库记录失败:', error)
      throw error
    }
  }

  /**
   * 更新库存数量
   * @param {string} itemId - 物品ID
   * @param {number} quantity - 数量
   * @param {string} operation - 操作类型：add/subtract
   */
  const updateInventoryQuantity = (itemId, quantity, operation) => {
    const item = inventoryList.value.find(item => item.id === itemId)
    if (item) {
      if (operation === 'add') {
        item.quantity += quantity
      } else if (operation === 'subtract') {
        item.quantity = Math.max(0, item.quantity - quantity)
      }
      item.updateTime = new Date()
      
      // 更新统计数据
      updateInventoryStatistics()
    }
  }

  /**
   * 库存调整
   * @param {string} itemId - 物品ID
   * @param {number} newQuantity - 新数量
   * @param {string} reason - 调整原因
   */
  const adjustInventory = async (itemId, newQuantity, reason) => {
    try {
      const item = inventoryList.value.find(item => item.id === itemId)
      if (!item) {
        throw new Error('物品不存在')
      }
      
      const oldQuantity = item.quantity
      const adjustmentQuantity = newQuantity - oldQuantity
      
      // 创建调整记录
      const adjustmentRecord = {
        id: `ADJ-${Date.now()}`,
        itemId,
        itemName: item.name,
        oldQuantity,
        newQuantity,
        adjustmentQuantity,
        reason,
        type: WAREHOUSE_OPERATION_TYPE.ADJUSTMENT,
        createTime: new Date(),
        operator: '系统管理员'
      }
      
      // 这里可以保存调整记录到数据库
      
      // 更新库存数量
      item.quantity = newQuantity
      item.updateTime = new Date()
      
      // 更新统计数据
      updateInventoryStatistics()
      
      return adjustmentRecord
    } catch (error) {
      console.error('库存调整失败:', error)
      throw error
    }
  }

  /**
   * 更新库存统计数据
   */
  const updateInventoryStatistics = () => {
    inventoryStatistics.value = {
      totalItems: inventoryList.value.length,
      totalValue: totalInventoryValue.value,
      lowStockItems: lowStockItems.value.length,
      outOfStockItems: outOfStockItems.value.length
    }
  }

  /**
   * 生成模拟库存数据
   */
  const generateMockInventory = () => {
    const mockData = []
    const categories = ['配件', '工具', '耗材', '润滑油', '滤芯']
    const items = {
      '配件': ['发动机配件', '液压配件', '传动配件', '电气配件'],
      '工具': ['扳手', '螺丝刀', '千斤顶', '测量工具'],
      '耗材': ['螺丝', '垫片', '密封圈', '胶带'],
      '润滑油': ['机油', '液压油', '齿轮油', '防冻液'],
      '滤芯': ['机油滤芯', '空气滤芯', '燃油滤芯', '液压滤芯']
    }
    
    let id = 1
    categories.forEach(category => {
      items[category].forEach(itemName => {
        const quantity = Math.floor(Math.random() * 1000)
        const unitPrice = Math.floor(Math.random() * 500) + 10
        const minStock = Math.floor(Math.random() * 50) + 10
        
        mockData.push({
          id: `ITEM${String(id).padStart(3, '0')}`,
          name: itemName,
          category,
          sku: `SKU${String(id).padStart(6, '0')}`,
          quantity,
          unitPrice,
          minStock,
          maxStock: minStock * 10,
          unit: ['个', '套', '升', '公斤'][Math.floor(Math.random() * 4)],
          warehouseId: ['WH001', 'WH002', 'WH003'][Math.floor(Math.random() * 3)],
          location: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}区-${Math.floor(Math.random() * 20) + 1}排-${Math.floor(Math.random() * 10) + 1}号`,
          supplier: ['供应商A', '供应商B', '供应商C'][Math.floor(Math.random() * 3)],
          lastInboundDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          updateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          remark: ''
        })
        id++
      })
    })
    
    return mockData
  }

  /**
   * 生成模拟仓库数据
   */
  const generateMockWarehouses = () => {
    return [
      {
        id: 'WH001',
        name: '主仓库',
        address: '上海市浦东新区张江高科技园区主仓库',
        manager: '张经理',
        phone: '021-12345678',
        area: 5000,
        capacity: 10000,
        status: 'active',
        createTime: new Date('2020-01-01')
      },
      {
        id: 'WH002',
        name: '备件仓库',
        address: '上海市浦东新区张江高科技园区备件仓库',
        manager: '李经理',
        phone: '021-87654321',
        area: 2000,
        capacity: 5000,
        status: 'active',
        createTime: new Date('2020-06-01')
      },
      {
        id: 'WH003',
        name: '临时仓库',
        address: '上海市浦东新区张江高科技园区临时仓库',
        manager: '王经理',
        phone: '021-11223344',
        area: 1000,
        capacity: 2000,
        status: 'active',
        createTime: new Date('2021-01-01')
      }
    ]
  }

  /**
   * 生成模拟入库记录
   */
  const generateMockInboundRecords = () => {
    const mockData = []
    const items = ['发动机配件', '液压配件', '机油', '滤芯', '工具']
    
    for (let i = 1; i <= 50; i++) {
      const createTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      
      mockData.push({
        id: `IN-2024-${String(i).padStart(3, '0')}`,
        itemId: `ITEM${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        itemName: items[Math.floor(Math.random() * items.length)],
        quantity: Math.floor(Math.random() * 100) + 10,
        unitPrice: Math.floor(Math.random() * 500) + 10,
        totalAmount: 0, // 会在下面计算
        warehouseId: ['WH001', 'WH002', 'WH003'][Math.floor(Math.random() * 3)],
        supplier: ['供应商A', '供应商B', '供应商C'][Math.floor(Math.random() * 3)],
        type: WAREHOUSE_OPERATION_TYPE.INBOUND,
        operator: '仓库管理员',
        createTime,
        remark: '正常入库'
      })
    }
    
    // 计算总金额
    mockData.forEach(record => {
      record.totalAmount = record.quantity * record.unitPrice
    })
    
    return mockData.sort((a, b) => b.createTime - a.createTime)
  }

  /**
   * 生成模拟出库记录
   */
  const generateMockOutboundRecords = () => {
    const mockData = []
    const items = ['发动机配件', '液压配件', '机油', '滤芯', '工具']
    const purposes = ['设备维修', '设备保养', '客户订单', '内部使用']
    
    for (let i = 1; i <= 50; i++) {
      const createTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      
      mockData.push({
        id: `OUT-2024-${String(i).padStart(3, '0')}`,
        itemId: `ITEM${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        itemName: items[Math.floor(Math.random() * items.length)],
        quantity: Math.floor(Math.random() * 50) + 1,
        unitPrice: Math.floor(Math.random() * 500) + 10,
        totalAmount: 0, // 会在下面计算
        warehouseId: ['WH001', 'WH002', 'WH003'][Math.floor(Math.random() * 3)],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        recipient: '设备维修部',
        type: WAREHOUSE_OPERATION_TYPE.OUTBOUND,
        operator: '仓库管理员',
        createTime,
        remark: '正常出库'
      })
    }
    
    // 计算总金额
    mockData.forEach(record => {
      record.totalAmount = record.quantity * record.unitPrice
    })
    
    return mockData.sort((a, b) => b.createTime - a.createTime)
  }

  /**
   * 清空仓储数据
   */
  const clearWarehouseData = () => {
    inventoryList.value = []
    warehouseList.value = []
    inboundRecords.value = []
    outboundRecords.value = []
    inventoryStatistics.value = {
      totalItems: 0,
      totalValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0
    }
  }

  return {
    // 状态
    inventoryList,
    warehouseList,
    inboundRecords,
    outboundRecords,
    warehouseLoading,
    inventoryStatistics,
    
    // 常量
    STOCK_STATUS,
    WAREHOUSE_OPERATION_TYPE,
    OPERATION_TYPE_LABELS,
    OPERATION_TYPE_COLORS,
    
    // 计算属性
    totalInventoryValue,
    lowStockItems,
    outOfStockItems,
    
    // 方法
    fetchInventoryList,
    fetchWarehouseList,
    fetchInboundRecords,
    fetchOutboundRecords,
    createInboundRecord,
    createOutboundRecord,
    updateInventoryQuantity,
    adjustInventory,
    clearWarehouseData
  }
})
