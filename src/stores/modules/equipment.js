import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 设备状态管理
 * 管理设备相关的数据和操作
 */
export const useEquipmentStore = defineStore('equipment', () => {
  // 状态定义
  const equipmentList = ref([]) // 设备列表
  const currentEquipment = ref(null) // 当前选中的设备
  const equipmentLoading = ref(false) // 设备加载状态
  const equipmentStatistics = ref({
    total: 0,
    available: 0, // 可用
    rented: 0, // 租赁中
    maintenance: 0, // 维护中
    broken: 0, // 故障
    retired: 0 // 报废
  })

  // 设备状态枚举
  const EQUIPMENT_STATUS = {
    AVAILABLE: 'available', // 可用
    RENTED: 'rented', // 租赁中
    MAINTENANCE: 'maintenance', // 维护中
    BROKEN: 'broken', // 故障
    RETIRED: 'retired' // 报废
  }

  // 设备状态标签映射
  const EQUIPMENT_STATUS_LABELS = {
    [EQUIPMENT_STATUS.AVAILABLE]: '可用',
    [EQUIPMENT_STATUS.RENTED]: '租赁中',
    [EQUIPMENT_STATUS.MAINTENANCE]: '维护中',
    [EQUIPMENT_STATUS.BROKEN]: '故障',
    [EQUIPMENT_STATUS.RETIRED]: '报废'
  }

  // 设备状态标签类型映射
  const EQUIPMENT_STATUS_TYPES = {
    [EQUIPMENT_STATUS.AVAILABLE]: 'success',
    [EQUIPMENT_STATUS.RENTED]: 'warning',
    [EQUIPMENT_STATUS.MAINTENANCE]: 'primary',
    [EQUIPMENT_STATUS.BROKEN]: 'danger',
    [EQUIPMENT_STATUS.RETIRED]: 'info'
  }

  // 计算属性
  const equipmentCount = computed(() => equipmentList.value.length)
  const availableEquipment = computed(() => 
    equipmentList.value.filter(equipment => equipment.status === EQUIPMENT_STATUS.AVAILABLE)
  )
  const rentedEquipment = computed(() => 
    equipmentList.value.filter(equipment => equipment.status === EQUIPMENT_STATUS.RENTED)
  )

  /**
   * 获取设备列表
   * @param {Object} params - 查询参数
   */
  const fetchEquipmentList = async (params = {}) => {
    equipmentLoading.value = true
    try {
      // 这里应该调用API获取设备列表
      // const response = await api.getEquipmentList(params)
      
      // 模拟API响应
      const mockEquipment = generateMockEquipment()
      equipmentList.value = mockEquipment
      
      // 更新统计数据
      updateEquipmentStatistics()
      
      return mockEquipment
    } catch (error) {
      console.error('获取设备列表失败:', error)
      throw error
    } finally {
      equipmentLoading.value = false
    }
  }

  /**
   * 获取设备详情
   * @param {string|number} equipmentId - 设备ID
   */
  const fetchEquipmentDetail = async (equipmentId) => {
    equipmentLoading.value = true
    try {
      // 这里应该调用API获取设备详情
      // const response = await api.getEquipmentDetail(equipmentId)
      
      // 模拟获取设备详情
      const equipment = equipmentList.value.find(e => e.id === equipmentId) || 
                      generateMockEquipmentDetail(equipmentId)
      
      currentEquipment.value = equipment
      return equipment
    } catch (error) {
      console.error('获取设备详情失败:', error)
      throw error
    } finally {
      equipmentLoading.value = false
    }
  }

  /**
   * 创建设备
   * @param {Object} equipmentData - 设备数据
   */
  const createEquipment = async (equipmentData) => {
    try {
      // 这里应该调用API创建设备
      // const response = await api.createEquipment(equipmentData)
      
      // 模拟创建设备
      const newEquipment = {
        id: `EQ-${Date.now()}`,
        ...equipmentData,
        status: EQUIPMENT_STATUS.AVAILABLE,
        createTime: new Date(),
        updateTime: new Date()
      }
      
      equipmentList.value.unshift(newEquipment)
      updateEquipmentStatistics()
      
      return newEquipment
    } catch (error) {
      console.error('创建设备失败:', error)
      throw error
    }
  }

  /**
   * 更新设备
   * @param {string|number} equipmentId - 设备ID
   * @param {Object} updateData - 更新数据
   */
  const updateEquipment = async (equipmentId, updateData) => {
    try {
      // 这里应该调用API更新设备
      // const response = await api.updateEquipment(equipmentId, updateData)
      
      // 模拟更新设备
      const index = equipmentList.value.findIndex(e => e.id === equipmentId)
      if (index !== -1) {
        equipmentList.value[index] = {
          ...equipmentList.value[index],
          ...updateData,
          updateTime: new Date()
        }
        
        // 如果是当前设备，也要更新
        if (currentEquipment.value && currentEquipment.value.id === equipmentId) {
          currentEquipment.value = equipmentList.value[index]
        }
      }
      
      updateEquipmentStatistics()
      return equipmentList.value[index]
    } catch (error) {
      console.error('更新设备失败:', error)
      throw error
    }
  }

  /**
   * 更新设备状态
   * @param {string|number} equipmentId - 设备ID
   * @param {string} status - 新状态
   * @param {string} remark - 备注
   */
  const updateEquipmentStatus = async (equipmentId, status, remark = '') => {
    try {
      const updateData = {
        status,
        remark,
        statusUpdateTime: new Date()
      }
      
      return await updateEquipment(equipmentId, updateData)
    } catch (error) {
      console.error('更新设备状态失败:', error)
      throw error
    }
  }

  /**
   * 删除设备
   * @param {string|number} equipmentId - 设备ID
   */
  const deleteEquipment = async (equipmentId) => {
    try {
      // 这里应该调用API删除设备
      // await api.deleteEquipment(equipmentId)
      
      // 从列表中移除
      const index = equipmentList.value.findIndex(e => e.id === equipmentId)
      if (index !== -1) {
        equipmentList.value.splice(index, 1)
      }
      
      // 如果删除的是当前设备，清空当前设备
      if (currentEquipment.value && currentEquipment.value.id === equipmentId) {
        currentEquipment.value = null
      }
      
      updateEquipmentStatistics()
      return true
    } catch (error) {
      console.error('删除设备失败:', error)
      throw error
    }
  }

  /**
   * 更新设备统计数据
   */
  const updateEquipmentStatistics = () => {
    const stats = {
      total: equipmentList.value.length,
      available: 0,
      rented: 0,
      maintenance: 0,
      broken: 0,
      retired: 0
    }
    
    equipmentList.value.forEach(equipment => {
      switch (equipment.status) {
        case EQUIPMENT_STATUS.AVAILABLE:
          stats.available++
          break
        case EQUIPMENT_STATUS.RENTED:
          stats.rented++
          break
        case EQUIPMENT_STATUS.MAINTENANCE:
          stats.maintenance++
          break
        case EQUIPMENT_STATUS.BROKEN:
          stats.broken++
          break
        case EQUIPMENT_STATUS.RETIRED:
          stats.retired++
          break
      }
    })
    
    equipmentStatistics.value = stats
  }

  /**
   * 生成模拟设备数据
   */
  const generateMockEquipment = () => {
    const mockData = []
    const statuses = Object.values(EQUIPMENT_STATUS)
    const types = ['挖掘机', '装载机', '推土机', '压路机', '起重机', '搅拌车']
    const models = {
      '挖掘机': ['CAT320D', 'CAT330D', 'PC200-8', 'PC360-7'],
      '装载机': ['LG956L', 'LG958L', 'ZL50GN'],
      '推土机': ['SD16', 'SD22', 'TY165-2'],
      '压路机': ['XS203J', 'XS223J', 'CC211'],
      '起重机': ['QY25K5', 'QY50KA', 'RT55E'],
      '搅拌车': ['HDT5257GJB', 'SY5256GJBDZ', 'ZLJ5259GJBJE']
    }
    
    for (let i = 1; i <= 100; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const modelList = models[type]
      const model = modelList[Math.floor(Math.random() * modelList.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const createTime = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      
      mockData.push({
        id: `EQ${String(i).padStart(3, '0')}`,
        name: `${type}${model}`,
        type,
        model,
        serialNumber: `${model}${String(i).padStart(3, '0')}`,
        status,
        purchaseDate: new Date(createTime.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        purchasePrice: Math.floor(Math.random() * 500000) + 100000,
        dailyRate: Math.floor(Math.random() * 1000) + 300,
        location: ['仓库A', '仓库B', '施工现场1', '施工现场2', '维修车间'][Math.floor(Math.random() * 5)],
        condition: ['优秀', '良好', '一般', '需维护'][Math.floor(Math.random() * 4)],
        totalWorkHours: Math.floor(Math.random() * 10000),
        lastMaintenanceDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        nextMaintenanceDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        createTime,
        updateTime: new Date(createTime.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        remark: status === EQUIPMENT_STATUS.BROKEN ? '发动机故障' : ''
      })
    }
    
    return mockData.sort((a, b) => b.createTime - a.createTime)
  }

  /**
   * 生成模拟设备详情
   */
  const generateMockEquipmentDetail = (equipmentId) => {
    return {
      id: equipmentId,
      name: '挖掘机CAT320D',
      type: '挖掘机',
      model: 'CAT320D',
      serialNumber: `CAT320D${equipmentId.slice(-3)}`,
      status: EQUIPMENT_STATUS.AVAILABLE,
      purchaseDate: new Date('2020-01-01'),
      purchasePrice: 350000,
      dailyRate: 800,
      location: '仓库A',
      condition: '良好',
      totalWorkHours: 5280,
      lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextMaintenanceDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createTime: new Date('2020-01-01'),
      updateTime: new Date(),
      remark: '',
      // 详细信息
      specifications: {
        weight: '22吨',
        power: '129kW',
        bucketCapacity: '1.2m³',
        maxDiggingDepth: '6.7m',
        maxDiggingReach: '10.1m'
      },
      maintenanceRecords: [
        {
          id: 1,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          type: '定期保养',
          description: '更换机油、滤芯，检查液压系统',
          cost: 2500,
          technician: '张师傅'
        },
        {
          id: 2,
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          type: '故障维修',
          description: '修复液压泵故障',
          cost: 8000,
          technician: '李师傅'
        }
      ],
      rentalHistory: [
        {
          id: 1,
          orderNo: 'ORD-2024-001',
          customer: '建设集团有限公司',
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          totalAmount: 24000,
          status: '已完成'
        }
      ]
    }
  }

  /**
   * 清空设备数据
   */
  const clearEquipmentData = () => {
    equipmentList.value = []
    currentEquipment.value = null
    equipmentStatistics.value = {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0,
      broken: 0,
      retired: 0
    }
  }

  return {
    // 状态
    equipmentList,
    currentEquipment,
    equipmentLoading,
    equipmentStatistics,
    
    // 常量
    EQUIPMENT_STATUS,
    EQUIPMENT_STATUS_LABELS,
    EQUIPMENT_STATUS_TYPES,
    
    // 计算属性
    equipmentCount,
    availableEquipment,
    rentedEquipment,
    
    // 方法
    fetchEquipmentList,
    fetchEquipmentDetail,
    createEquipment,
    updateEquipment,
    updateEquipmentStatus,
    deleteEquipment,
    clearEquipmentData
  }
})
