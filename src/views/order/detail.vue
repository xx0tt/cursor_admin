<template>
  <!-- 订单详情页面 -->
  <div class="order-detail-container page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="handleGoBack">
          返回
        </el-button>
        <div class="page-title">订单详情</div>
      </div>
      <div class="header-actions">
        <el-button :icon="Printer" @click="handlePrint">
          打印
        </el-button>
        <el-button type="primary" :icon="Edit" @click="handleEdit" v-if="canEdit">
          编辑
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-loading="orderLoading" class="loading-container" v-if="orderLoading">
      <div style="height: 400px;"></div>
    </div>

    <!-- 订单内容 -->
    <div v-else-if="orderDetail" class="order-content">
      <!-- 订单基本信息 -->
      <div class="info-section card">
        <div class="section-header">
          <h3 class="section-title">基本信息</h3>
          <div class="order-status">
            <el-tag
              :type="ORDER_STATUS_TYPES[orderDetail.status]"
              size="large"
            >
              {{ ORDER_STATUS_LABELS[orderDetail.status] }}
            </el-tag>
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <label class="info-label">订单号：</label>
            <span class="info-value">{{ orderDetail.orderNo }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">客户名称：</label>
            <span class="info-value">{{ orderDetail.customerName }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">联系电话：</label>
            <span class="info-value">{{ orderDetail.customerPhone }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">联系人：</label>
            <span class="info-value">{{ orderDetail.contact }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">项目地址：</label>
            <span class="info-value">{{ orderDetail.address }}</span>
          </div>
          
          <div class="info-item">
            <label class="info-label">创建时间：</label>
            <span class="info-value">{{ formatDateTime(orderDetail.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 设备信息 -->
      <div class="equipment-section card">
        <div class="section-header">
          <h3 class="section-title">设备信息</h3>
        </div>
        
        <div class="equipment-summary">
          <div class="summary-item">
            <span class="summary-label">设备类型：</span>
            <span class="summary-value">{{ orderDetail.equipmentType }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">设备型号：</span>
            <span class="summary-value">{{ orderDetail.equipmentModel }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">租赁数量：</span>
            <span class="summary-value">{{ orderDetail.quantity }} 台</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">单价：</span>
            <span class="summary-value">¥{{ formatAmount(orderDetail.unitPrice) }}/天</span>
          </div>
        </div>

        <!-- 设备详情列表 -->
        <div class="equipment-list" v-if="orderDetail.equipmentDetails">
          <h4 class="list-title">设备详情</h4>
          <el-table :data="orderDetail.equipmentDetails" style="width: 100%">
            <el-table-column prop="id" label="设备编号" width="120" />
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="serialNumber" label="序列号" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === '租赁中' ? 'warning' : 'success'"
                  size="small"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 租赁信息 -->
      <div class="rental-section card">
        <div class="section-header">
          <h3 class="section-title">租赁信息</h3>
        </div>
        
        <div class="rental-timeline">
          <div class="timeline-item">
            <div class="timeline-dot start"></div>
            <div class="timeline-content">
              <div class="timeline-title">租赁开始</div>
              <div class="timeline-time">{{ formatDateTime(orderDetail.rentStartDate) }}</div>
            </div>
          </div>
          
          <div class="timeline-line"></div>
          
          <div class="timeline-item">
            <div class="timeline-dot end"></div>
            <div class="timeline-content">
              <div class="timeline-title">租赁结束</div>
              <div class="timeline-time">{{ formatDateTime(orderDetail.rentEndDate) }}</div>
            </div>
          </div>
        </div>
        
        <div class="rental-summary">
          <div class="summary-card">
            <div class="summary-title">租赁天数</div>
            <div class="summary-number">
              {{ calculateRentDays(orderDetail.rentStartDate, orderDetail.rentEndDate) }}
            </div>
            <div class="summary-unit">天</div>
          </div>
          
          <div class="summary-card">
            <div class="summary-title">总金额</div>
            <div class="summary-number total-amount">
              ¥{{ formatAmount(orderDetail.totalAmount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 订单进度 -->
      <div class="progress-section card" v-if="orderDetail.timeline">
        <div class="section-header">
          <h3 class="section-title">订单进度</h3>
        </div>
        
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in orderDetail.timeline"
            :key="index"
            :timestamp="formatDateTime(item.time)"
            :type="getTimelineType(item.status)"
          >
            <div class="timeline-item-content">
              <div class="timeline-item-title">{{ item.status }}</div>
              <div class="timeline-item-operator">操作人：{{ item.operator }}</div>
              <div class="timeline-item-remark" v-if="item.remark">
                {{ item.remark }}
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 备注信息 -->
      <div class="remarks-section card" v-if="orderDetail.remark">
        <div class="section-header">
          <h3 class="section-title">备注信息</h3>
        </div>
        <div class="remarks-content">
          {{ orderDetail.remark }}
        </div>
      </div>
    </div>

    <!-- 订单不存在 -->
    <div v-else class="not-found">
      <el-empty description="订单不存在或已被删除">
        <el-button type="primary" @click="handleGoBack">
          返回列表
        </el-button>
      </el-empty>
    </div>

    <!-- 编辑对话框 -->
    <OrderEditDialog
      v-model:visible="editDialogVisible"
      :order="orderDetail"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '@/stores'
import OrderEditDialog from './components/OrderEditDialog.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// 解构store中的数据
const { 
  currentOrder: orderDetail, 
  orderLoading, 
  ORDER_STATUS, 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_TYPES 
} = orderStore

// 响应式数据
const editDialogVisible = ref(false)

// 计算属性
const canEdit = computed(() => {
  if (!orderDetail.value) return false
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(orderDetail.value.status)
})

/**
 * 处理返回
 */
const handleGoBack = () => {
  router.go(-1)
}

/**
 * 处理打印
 */
const handlePrint = () => {
  window.print()
}

/**
 * 处理编辑
 */
const handleEdit = () => {
  editDialogVisible.value = true
}

/**
 * 处理编辑成功
 */
const handleEditSuccess = () => {
  // 重新加载订单详情
  loadOrderDetail()
  ElMessage.success('订单更新成功')
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

/**
 * 获取时间轴类型
 */
const getTimelineType = (status) => {
  const typeMap = {
    '订单创建': 'primary',
    '订单确认': 'success',
    '开始执行': 'warning',
    '订单完成': 'success',
    '订单取消': 'danger'
  }
  return typeMap[status] || 'info'
}

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  const orderId = route.params.id
  if (!orderId) {
    ElMessage.error('订单ID不能为空')
    handleGoBack()
    return
  }

  try {
    await orderStore.fetchOrderDetail(orderId)
  } catch (error) {
    ElMessage.error('加载订单详情失败')
    console.error('加载订单详情失败:', error)
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadOrderDetail()
    }
  },
  { immediate: true }
)

// 组件挂载时加载数据
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
/* 页面容器样式 */
.order-detail-container {
  padding: 20px;
}

.loading-container {
  background: var(--card-bg);
  border-radius: 8px;
}

/* 页面头部样式 */
.page-header {
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 订单内容样式 */
.order-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 通用区域样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 基本信息样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 80px;
}

.info-value {
  color: var(--text-primary);
  flex: 1;
}

/* 设备信息样式 */
.equipment-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
}

.summary-label {
  font-weight: 500;
  color: var(--text-secondary);
  margin-right: 8px;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 500;
}

.list-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

/* 租赁信息样式 */
.rental-timeline {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 8px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
}

.timeline-dot.start {
  background: var(--success-color);
}

.timeline-dot.end {
  background: var(--primary-color);
}

.timeline-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, var(--success-color), var(--primary-color));
  margin: 0 20px;
}

.timeline-content {
  text-align: center;
}

.timeline-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.rental-summary {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.summary-card {
  text-align: center;
  padding: 20px;
  background: var(--bg-color);
  border-radius: 8px;
  min-width: 120px;
}

.summary-title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.summary-number {
  font-size: 32px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.summary-number.total-amount {
  color: var(--success-color);
}

.summary-unit {
  font-size: 12px;
  color: var(--text-placeholder);
}

/* 订单进度样式 */
.timeline-item-content {
  padding: 8px 0;
}

.timeline-item-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.timeline-item-operator {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.timeline-item-remark {
  font-size: 12px;
  color: var(--text-placeholder);
  font-style: italic;
}

/* 备注信息样式 */
.remarks-content {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* 订单不存在样式 */
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--card-bg);
  border-radius: 8px;
}

/* 打印样式 */
@media print {
  .page-header {
    display: none;
  }
  
  .order-detail-container {
    padding: 0;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-detail-container {
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
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .equipment-summary {
    grid-template-columns: 1fr;
  }
  
  .rental-timeline {
    flex-direction: column;
    gap: 16px;
  }
  
  .timeline-line {
    width: 2px;
    height: 40px;
    margin: 0;
  }
  
  .rental-summary {
    flex-direction: column;
  }
  
  .summary-card {
    min-width: auto;
  }
}
</style>
