<template>
  <!-- 订单管理页面 -->
  <div class="order-list-container page-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="page-title">订单管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleCreateOrder">
          新建订单
        </el-button>
        <el-button :icon="Download" @click="handleExport">
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section card">
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        :inline="true"
        class="search-form"
      >
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="客户名称">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="设备类型">
          <el-select
            v-model="searchForm.equipmentType"
            placeholder="请选择设备类型"
            clearable
          >
            <el-option
              v-for="type in equipmentTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择订单状态"
            clearable
          >
            <el-option
              v-for="(label, value) in ORDER_STATUS_LABELS"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-section">
      <el-row :gutter="16">
        <el-col :span="6" v-for="stat in orderStatistics" :key="stat.key">
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

    <!-- 订单列表 -->
    <div class="table-section card">
      <div class="table-header">
        <div class="table-title">订单列表</div>
        <div class="table-actions">
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedOrders.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
      </div>
      
      <el-table
        ref="tableRef"
        v-loading="orderLoading"
        :data="displayOrders"
        row-key="id"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" align="center" />
        
        <!-- 订单号 -->
        <el-table-column
          prop="orderNo"
          label="订单号"
          width="140"
          sortable="custom"
        >
          <template #default="{ row }">
            <el-button
              type="text"
              @click="handleViewDetail(row)"
              class="order-link"
            >
              {{ row.orderNo }}
            </el-button>
          </template>
        </el-table-column>
        
        <!-- 客户信息 -->
        <el-table-column label="客户信息" width="200">
          <template #default="{ row }">
            <div class="customer-info">
              <div class="customer-name">{{ row.customerName }}</div>
              <div class="customer-phone">{{ row.customerPhone }}</div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 设备信息 -->
        <el-table-column label="设备信息" width="180">
          <template #default="{ row }">
            <div class="equipment-info">
              <div class="equipment-type">{{ row.equipmentType }}</div>
              <div class="equipment-detail">
                {{ row.equipmentModel }} × {{ row.quantity }}
              </div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 租赁时间 -->
        <el-table-column label="租赁时间" width="200">
          <template #default="{ row }">
            <div class="rent-time">
              <div>{{ formatDate(row.rentStartDate) }}</div>
              <div>至 {{ formatDate(row.rentEndDate) }}</div>
              <div class="rent-days">
                共 {{ calculateRentDays(row.rentStartDate, row.rentEndDate) }} 天
              </div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 订单金额 -->
        <el-table-column
          prop="totalAmount"
          label="订单金额"
          width="120"
          sortable="custom"
          align="right"
        >
          <template #default="{ row }">
            <div class="amount">¥{{ formatAmount(row.totalAmount) }}</div>
          </template>
        </el-table-column>
        
        <!-- 订单状态 -->
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="ORDER_STATUS_TYPES[row.status]"
              size="small"
            >
              {{ ORDER_STATUS_LABELS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        
        <!-- 操作列 -->
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                type="text"
                size="small"
                @click="handleViewDetail(row)"
              >
                查看
              </el-button>
              
              <el-button
                type="text"
                size="small"
                @click="handleEdit(row)"
                v-if="canEdit(row)"
              >
                编辑
              </el-button>
              
              <!-- 状态操作按钮 -->
              <el-dropdown
                v-if="getStatusActions(row).length > 0"
                @command="(action) => handleStatusAction(row, action)"
              >
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
              
              <el-button
                type="text"
                size="small"
                @click="handleDelete(row)"
                class="danger-button"
                v-if="canDelete(row)"
              >
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

    <!-- 订单详情抽屉 -->
    <OrderDetailDrawer
      v-model:visible="detailDrawerVisible"
      :order-id="selectedOrderId"
      @refresh="handleRefresh"
    />

    <!-- 订单编辑对话框 -->
    <OrderEditDialog
      v-model:visible="editDialogVisible"
      :order="selectedOrder"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores'
import OrderDetailDrawer from './components/OrderDetailDrawer.vue'
import OrderEditDialog from './components/OrderEditDialog.vue'

const router = useRouter()
const orderStore = useOrderStore()

// 解构store中的数据
const { 
  orders, 
  orderLoading, 
  ORDER_STATUS, 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_TYPES 
} = orderStore

// 响应式数据
const searchFormRef = ref()
const tableRef = ref()
const selectedOrders = ref([])
const detailDrawerVisible = ref(false)
const editDialogVisible = ref(false)
const selectedOrderId = ref('')
const selectedOrder = ref(null)

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  customerName: '',
  equipmentType: '',
  status: '',
  dateRange: []
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
const equipmentTypes = reactive([
  { label: '挖掘机', value: '挖掘机' },
  { label: '装载机', value: '装载机' },
  { label: '推土机', value: '推土机' },
  { label: '压路机', value: '压路机' },
  { label: '起重机', value: '起重机' },
  { label: '搅拌车', value: '搅拌车' }
])

// 计算属性
const displayOrders = computed(() => {
  let filteredOrders = [...orders.value]
  
  // 搜索过滤
  if (searchForm.orderNo) {
    filteredOrders = filteredOrders.filter(order =>
      order.orderNo.toLowerCase().includes(searchForm.orderNo.toLowerCase())
    )
  }
  
  if (searchForm.customerName) {
    filteredOrders = filteredOrders.filter(order =>
      order.customerName.toLowerCase().includes(searchForm.customerName.toLowerCase())
    )
  }
  
  if (searchForm.equipmentType) {
    filteredOrders = filteredOrders.filter(order =>
      order.equipmentType === searchForm.equipmentType
    )
  }
  
  if (searchForm.status) {
    filteredOrders = filteredOrders.filter(order =>
      order.status === searchForm.status
    )
  }
  
  if (searchForm.dateRange && searchForm.dateRange.length === 2) {
    const [startDate, endDate] = searchForm.dateRange
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = formatDate(order.createTime)
      return orderDate >= startDate && orderDate <= endDate
    })
  }
  
  // 排序
  if (sortData.prop) {
    filteredOrders.sort((a, b) => {
      let aValue = a[sortData.prop]
      let bValue = b[sortData.prop]
      
      if (sortData.prop === 'createTime') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortData.prop === 'totalAmount') {
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
  pagination.total = filteredOrders.length
  
  // 分页
  const start = (pagination.page - 1) * pagination.size
  const end = start + pagination.size
  return filteredOrders.slice(start, end)
})

// 订单统计数据
const orderStatistics = computed(() => [
  {
    key: 'total',
    label: '总订单',
    value: orderStore.orderStatistics.total,
    icon: 'Document',
    color: '#409EFF'
  },
  {
    key: 'pending',
    label: '待确认',
    value: orderStore.orderStatistics.pending,
    icon: 'Clock',
    color: '#E6A23C'
  },
  {
    key: 'inProgress',
    label: '进行中',
    value: orderStore.orderStatistics.inProgress,
    icon: 'Loading',
    color: '#67C23A'
  },
  {
    key: 'completed',
    label: '已完成',
    value: orderStore.orderStatistics.completed,
    icon: 'Check',
    color: '#909399'
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
    orderNo: '',
    customerName: '',
    equipmentType: '',
    status: '',
    dateRange: []
  })
  pagination.page = 1
  handleSearch()
}

/**
 * 处理表格选择变化
 */
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
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
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
}

/**
 * 处理页码变化
 */
const handlePageChange = (page) => {
  pagination.page = page
}

/**
 * 处理创建订单
 */
const handleCreateOrder = () => {
  router.push('/order/create')
}

/**
 * 处理查看详情
 */
const handleViewDetail = (order) => {
  selectedOrderId.value = order.id
  detailDrawerVisible.value = true
}

/**
 * 处理编辑订单
 */
const handleEdit = (order) => {
  selectedOrder.value = order
  editDialogVisible.value = true
}

/**
 * 处理编辑成功
 */
const handleEditSuccess = () => {
  handleRefresh()
  ElMessage.success('订单更新成功')
}

/**
 * 处理状态操作
 */
const handleStatusAction = async (order, action) => {
  try {
    await ElMessageBox.confirm(
      `确定要将订单状态更改为"${ORDER_STATUS_LABELS[action]}"吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await orderStore.updateOrderStatus(order.id, action)
    ElMessage.success('订单状态更新成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('状态更新失败')
    }
  }
}

/**
 * 处理删除订单
 */
const handleDelete = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除订单"${order.orderNo}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await orderStore.deleteOrder(order.id)
    ElMessage.success('订单删除成功')
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
      `确定要删除选中的 ${selectedOrders.value.length} 个订单吗？此操作不可恢复。`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const promises = selectedOrders.value.map(order => 
      orderStore.deleteOrder(order.id)
    )
    
    await Promise.all(promises)
    ElMessage.success('批量删除成功')
    
    // 清空选择
    selectedOrders.value = []
    tableRef.value?.clearSelection()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

/**
 * 处理导出数据
 */
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

/**
 * 处理刷新
 */
const handleRefresh = () => {
  orderStore.fetchOrders()
}

/**
 * 判断是否可以编辑
 */
const canEdit = (order) => {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)
}

/**
 * 判断是否可以删除
 */
const canDelete = (order) => {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED].includes(order.status)
}

/**
 * 获取状态操作选项
 */
const getStatusActions = (order) => {
  const actions = []
  
  switch (order.status) {
    case ORDER_STATUS.PENDING:
      actions.push(
        { label: '确认订单', value: ORDER_STATUS.CONFIRMED },
        { label: '取消订单', value: ORDER_STATUS.CANCELLED }
      )
      break
    case ORDER_STATUS.CONFIRMED:
      actions.push(
        { label: '开始执行', value: ORDER_STATUS.IN_PROGRESS },
        { label: '取消订单', value: ORDER_STATUS.CANCELLED }
      )
      break
    case ORDER_STATUS.IN_PROGRESS:
      actions.push(
        { label: '完成订单', value: ORDER_STATUS.COMPLETED }
      )
      break
  }
  
  return actions
}

/**
 * 格式化日期
 */
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

/**
 * 格式化日期时间
 */
const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 格式化金额
 */
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 计算租赁天数
 */
const calculateRentDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

// 组件挂载时加载数据
onMounted(() => {
  handleRefresh()
})
</script>

<style scoped>
/* 页面容器样式 */
.order-list-container {
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
.order-link {
  color: var(--primary-color);
  font-weight: 500;
}

.customer-info {
  line-height: 1.4;
}

.customer-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.customer-phone {
  font-size: 12px;
  color: var(--text-secondary);
}

.equipment-info {
  line-height: 1.4;
}

.equipment-type {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.equipment-detail {
  font-size: 12px;
  color: var(--text-secondary);
}

.rent-time {
  line-height: 1.4;
  font-size: 12px;
}

.rent-days {
  color: var(--primary-color);
  font-weight: 500;
  margin-top: 4px;
}

.amount {
  font-weight: 600;
  color: var(--text-primary);
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
  .order-list-container {
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