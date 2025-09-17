<template>
  <!-- 设备管理页面 -->
  <div class="equipment-list-container page-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="page-title">设备管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddEquipment"> 添加设备 </el-button>
        <el-button :icon="Upload" @click="handleImport"> 批量导入 </el-button>
        <el-button :icon="Download" @click="handleExport"> 导出数据 </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section card">
      <el-form ref="searchFormRef" :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="设备类型">
          <el-select v-model="searchForm.type" placeholder="请选择设备类型" clearable>
            <el-option v-for="type in equipmentTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>

        <el-form-item label="设备状态">
          <el-select v-model="searchForm.status" placeholder="请选择设备状态" clearable>
            <el-option
              v-for="(label, value) in EQUIPMENT_STATUS_LABELS"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="存放位置">
          <el-input
            v-model="searchForm.location"
            placeholder="请输入存放位置"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
          <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-section">
      <el-row :gutter="16">
        <el-col :span="4" v-for="stat in equipmentStatistics" :key="stat.key">
          <div class="stat-card">
            <div class="stat-icon" :style="{ backgroundColor: stat.color + '20' }">
              <el-icon :size="24" :color="stat.color">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 设备列表 -->
    <div class="table-section card">
      <div class="table-header">
        <div class="table-title">设备列表</div>
        <div class="table-actions">
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedEquipment.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
      </div>

      <el-table
        ref="tableRef"
        v-loading="equipmentLoading"
        :data="displayEquipment"
        row-key="id"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" align="center" />

        <!-- 设备编号 -->
        <el-table-column prop="id" label="设备编号" width="120" sortable="custom">
          <template #default="{ row }">
            <el-button type="text" @click="handleViewDetail(row)" class="equipment-link">
              {{ row.id }}
            </el-button>
          </template>
        </el-table-column>

        <!-- 设备信息 -->
        <el-table-column label="设备信息" width="200">
          <template #default="{ row }">
            <div class="equipment-info">
              <div class="equipment-name">{{ row.name }}</div>
              <div class="equipment-model">{{ row.type }} - {{ row.model }}</div>
              <div class="equipment-serial">序列号: {{ row.serialNumber }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 设备状态 -->
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="EQUIPMENT_STATUS_TYPES[row.status]" size="small">
              {{ EQUIPMENT_STATUS_LABELS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 位置信息 -->
        <el-table-column prop="location" label="存放位置" width="120" />

        <!-- 设备状况 -->
        <el-table-column prop="condition" label="设备状况" width="100">
          <template #default="{ row }">
            <el-tag :type="getConditionType(row.condition)" size="small">
              {{ row.condition }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 日租金 -->
        <el-table-column
          prop="dailyRate"
          label="日租金"
          width="100"
          sortable="custom"
          align="right"
        >
          <template #default="{ row }">
            <div class="daily-rate">¥{{ formatAmount(row.dailyRate) }}</div>
          </template>
        </el-table-column>

        <!-- 工作时长 -->
        <el-table-column
          prop="totalWorkHours"
          label="工作时长"
          width="120"
          sortable="custom"
          align="center"
        >
          <template #default="{ row }">
            <div class="work-hours">{{ row.totalWorkHours }}h</div>
          </template>
        </el-table-column>

        <!-- 下次维护 -->
        <el-table-column label="下次维护" width="120">
          <template #default="{ row }">
            <div class="maintenance-date">
              {{ formatDate(row.nextMaintenanceDate) }}
            </div>
          </template>
        </el-table-column>

        <!-- 购买日期 -->
        <el-table-column prop="purchaseDate" label="购买日期" width="120" sortable="custom">
          <template #default="{ row }">
            {{ formatDate(row.purchaseDate) }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="text" size="small" @click="handleViewDetail(row)"> 查看 </el-button>

              <el-button type="text" size="small" @click="handleEdit(row)"> 编辑 </el-button>

              <!-- 状态操作按钮 -->
              <el-dropdown @command="action => handleStatusAction(row, action)">
                <el-button type="text" size="small">
                  状态 <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="action in getStatusActions(row)"
                      :key="action.value"
                      :command="action.value"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-button type="text" size="small" @click="handleDelete(row)" class="danger-button">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEquipmentStore } from '@/stores'

const equipmentStore = useEquipmentStore()

// 使用 storeToRefs 保持 ref，不触发自动解包
const {
  equipmentList,
  equipmentLoading,
  equipmentStatistics: storeStatistics
} = storeToRefs(equipmentStore)
// 常量直接读取即可
const { EQUIPMENT_STATUS_LABELS, EQUIPMENT_STATUS_TYPES } = equipmentStore

// 响应式数据
const searchFormRef = ref()
const tableRef = ref()
const selectedEquipment = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: '',
  location: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 排序数据
const sortData = reactive({
  prop: 'createTime',
  order: 'descending'
})

// 设备类型选项
const equipmentTypes = reactive(['挖掘机', '装载机', '推土机', '压路机', '起重机', '搅拌车'])

// 计算属性
const displayEquipment = computed(() => {
  const source = Array.isArray(equipmentList.value) ? equipmentList.value : []
  let filteredEquipment = [...source]

  // 搜索过滤
  if (searchForm.name) {
    filteredEquipment = filteredEquipment.filter(equipment =>
      equipment.name.toLowerCase().includes(searchForm.name.toLowerCase())
    )
  }

  if (searchForm.type) {
    filteredEquipment = filteredEquipment.filter(equipment => equipment.type === searchForm.type)
  }

  if (searchForm.status) {
    filteredEquipment = filteredEquipment.filter(
      equipment => equipment.status === searchForm.status
    )
  }

  if (searchForm.location) {
    filteredEquipment = filteredEquipment.filter(equipment =>
      equipment.location.toLowerCase().includes(searchForm.location.toLowerCase())
    )
  }

  // 排序
  if (sortData.prop) {
    filteredEquipment.sort((a, b) => {
      let aValue = a[sortData.prop]
      let bValue = b[sortData.prop]

      if (sortData.prop.includes('Date')) {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === 'number') {
        aValue = parseFloat(aValue) || 0
        bValue = parseFloat(bValue) || 0
      }

      if (sortData.order === 'ascending') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // 更新总数
  pagination.total = filteredEquipment.length

  // 分页
  const start = (pagination.page - 1) * pagination.size
  const end = start + pagination.size
  return filteredEquipment.slice(start, end)
})

// 设备统计数据
const equipmentStatistics = computed(() => [
  {
    key: 'total',
    label: '设备总数',
    value: storeStatistics.value.total,
    icon: 'Monitor',
    color: '#409EFF'
  },
  {
    key: 'available',
    label: '可用设备',
    value: storeStatistics.value.available,
    icon: 'Check',
    color: '#67C23A'
  },
  {
    key: 'rented',
    label: '租赁中',
    value: storeStatistics.value.rented,
    icon: 'Loading',
    color: '#E6A23C'
  },
  {
    key: 'maintenance',
    label: '维护中',
    value: storeStatistics.value.maintenance,
    icon: 'Tools',
    color: '#909399'
  },
  {
    key: 'broken',
    label: '故障设备',
    value: storeStatistics.value.broken,
    icon: 'Warning',
    color: '#F56C6C'
  },
  {
    key: 'retired',
    label: '已报废',
    value: storeStatistics.value.retired,
    icon: 'Close',
    color: '#C0C4CC'
  }
])

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1
  // 搜索逻辑在computed中处理
}

/**
 * 处理重置
 */
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: '',
    location: ''
  })
  pagination.page = 1
  handleSearch()
}

/**
 * 处理表格选择变化
 */
const handleSelectionChange = selection => {
  selectedEquipment.value = selection
}

/**
 * 处理排序变化
 */
const handleSortChange = ({ prop, order }) => {
  sortData.prop = prop
  sortData.order = order
}

/**
 * 处理分页大小变化
 */
const handleSizeChange = size => {
  pagination.size = size
  pagination.page = 1
}

/**
 * 处理页码变化
 */
const handlePageChange = page => {
  pagination.page = page
}

/**
 * 处理添加设备
 */
const handleAddEquipment = () => {
  ElMessage.info('添加设备功能开发中...')
}

/**
 * 处理批量导入
 */
const handleImport = () => {
  ElMessage.info('批量导入功能开发中...')
}

/**
 * 处理导出数据
 */
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

/**
 * 处理查看详情
 */
const handleViewDetail = equipment => {
  ElMessage.info(`查看设备详情: ${equipment.name}`)
}

/**
 * 处理编辑设备
 */
const handleEdit = equipment => {
  ElMessage.info(`编辑设备: ${equipment.name}`)
}

/**
 * 处理状态操作
 */
const handleStatusAction = async (equipment, action) => {
  try {
    await ElMessageBox.confirm(
      `确定要将设备状态更改为"${EQUIPMENT_STATUS_LABELS[action]}"吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await equipmentStore.updateEquipmentStatus(equipment.id, action)
    ElMessage.success('设备状态更新成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('状态更新失败')
    }
  }
}

/**
 * 处理删除设备
 */
const handleDelete = async equipment => {
  try {
    await ElMessageBox.confirm(
      `确定要删除设备"${equipment.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await equipmentStore.deleteEquipment(equipment.id)
    ElMessage.success('设备删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedEquipment.value.length} 个设备吗？此操作不可恢复。`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const promises = selectedEquipment.value.map(equipment =>
      equipmentStore.deleteEquipment(equipment.id)
    )

    await Promise.all(promises)
    ElMessage.success('批量删除成功')

    // 清空选择
    selectedEquipment.value = []
    tableRef.value?.clearSelection()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

/**
 * 获取状态操作选项
 */
const getStatusActions = equipment => {
  const actions = []
  const currentStatus = equipment.status

  // 根据当前状态显示可用的操作
  if (currentStatus !== 'available') {
    actions.push({ label: '设为可用', value: 'available' })
  }
  if (currentStatus !== 'maintenance') {
    actions.push({ label: '送去维护', value: 'maintenance' })
  }
  if (currentStatus !== 'broken') {
    actions.push({ label: '标记故障', value: 'broken' })
  }
  if (currentStatus !== 'retired') {
    actions.push({ label: '设为报废', value: 'retired' })
  }

  return actions
}

/**
 * 获取设备状况标签类型
 */
const getConditionType = condition => {
  const typeMap = {
    优秀: 'success',
    良好: 'primary',
    一般: 'warning',
    需维护: 'danger'
  }
  return typeMap[condition] || 'info'
}

/**
 * 格式化日期
 */
const formatDate = date => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

/**
 * 格式化金额
 */
const formatAmount = amount => {
  if (!amount) return '0.00'
  return parseFloat(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 处理刷新
 */
const handleRefresh = () => {
  equipmentStore.fetchEquipmentList()
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})
</script>

<style scoped>
/* 页面容器样式 */
.equipment-list-container {
  padding: 20px;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 20px;
  padding: 20px;
}

.search-form .el-form-item {
  margin-bottom: 16px;
}

/* 统计卡片样式 */
.statistics-section {
  margin-bottom: 20px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 表格区域样式 */
.table-section {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 表格内容样式 */
.equipment-link {
  color: var(--primary-color);
  font-weight: 500;
}

.equipment-info {
  line-height: 1.4;
}

.equipment-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.equipment-model {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.equipment-serial {
  font-size: 12px;
  color: var(--text-placeholder);
}

.daily-rate {
  font-weight: 600;
  color: var(--success-color);
}

.work-hours {
  font-weight: 500;
  color: var(--text-primary);
}

.maintenance-date {
  font-size: 12px;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.danger-button {
  color: var(--danger-color);
}

.danger-button:hover {
  color: var(--danger-color);
  background-color: rgba(245, 108, 108, 0.1);
}

/* 分页样式 */
.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .equipment-list-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    display: flex;
    gap: 8px;
  }

  .search-form {
    display: block;
  }

  .search-form .el-form-item {
    display: block;
    margin-bottom: 12px;
  }

  .statistics-section .el-col {
    margin-bottom: 12px;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pagination-container {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
