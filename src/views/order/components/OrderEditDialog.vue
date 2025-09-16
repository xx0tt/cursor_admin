<template>
  <!-- 订单编辑对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑订单' : '新建订单'"
    width="800px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <!-- 表单内容 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      class="order-form"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h4 class="section-title">基本信息</h4>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input
                v-model="formData.customerName"
                placeholder="请输入客户名称"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="联系电话" prop="customerPhone">
              <el-input
                v-model="formData.customerPhone"
                placeholder="请输入联系电话"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input
                v-model="formData.contact"
                placeholder="请输入联系人"
                clearable
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="项目地址" prop="address">
              <el-input
                v-model="formData.address"
                placeholder="请输入项目地址"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 设备信息 -->
      <div class="form-section">
        <h4 class="section-title">设备信息</h4>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="设备类型" prop="equipmentType">
              <el-select
                v-model="formData.equipmentType"
                placeholder="请选择设备类型"
                clearable
                style="width: 100%"
                @change="handleEquipmentTypeChange"
              >
                <el-option
                  v-for="type in equipmentTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="设备型号" prop="equipmentModel">
              <el-select
                v-model="formData.equipmentModel"
                placeholder="请选择设备型号"
                clearable
                style="width: 100%"
                :disabled="!formData.equipmentType"
                @change="handleEquipmentModelChange"
              >
                <el-option
                  v-for="model in availableModels"
                  :key="model.value"
                  :label="model.label"
                  :value="model.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="租赁数量" prop="quantity">
              <el-input-number
                v-model="formData.quantity"
                :min="1"
                :max="10"
                placeholder="数量"
                style="width: 100%"
                @change="calculateTotalAmount"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="单价(元/天)" prop="unitPrice">
              <el-input-number
                v-model="formData.unitPrice"
                :min="0"
                :precision="2"
                placeholder="单价"
                style="width: 100%"
                @change="calculateTotalAmount"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="总金额">
              <el-input
                :value="formatAmount(formData.totalAmount)"
                readonly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 租赁时间 -->
      <div class="form-section">
        <h4 class="section-title">租赁时间</h4>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="rentStartDate">
              <el-date-picker
                v-model="formData.rentStartDate"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledStartDate"
                @change="calculateTotalAmount"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="结束时间" prop="rentEndDate">
              <el-date-picker
                v-model="formData.rentEndDate"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled-date="disabledEndDate"
                @change="calculateTotalAmount"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <div class="rent-summary" v-if="rentDays > 0">
              <span class="summary-text">
                租赁天数：<strong>{{ rentDays }}</strong> 天
              </span>
              <span class="summary-text">
                总金额：<strong class="total-amount">¥{{ formatAmount(formData.totalAmount) }}</strong>
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 备注信息 -->
      <div class="form-section">
        <h4 class="section-title">备注信息</h4>
        
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </div>
    </el-form>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '@/stores'

// Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  }
})

// Emits定义
const emit = defineEmits(['update:visible', 'success'])

const orderStore = useOrderStore()

// 响应式数据
const formRef = ref()
const submitLoading = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isEdit = computed(() => !!props.order)

// 表单数据
const formData = reactive({
  customerName: '',
  customerPhone: '',
  contact: '',
  address: '',
  equipmentType: '',
  equipmentModel: '',
  quantity: 1,
  unitPrice: 0,
  totalAmount: 0,
  rentStartDate: '',
  rentEndDate: '',
  remark: ''
})

// 表单验证规则
const formRules = reactive({
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '客户名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  customerPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入项目地址', trigger: 'blur' }
  ],
  equipmentType: [
    { required: true, message: '请选择设备类型', trigger: 'change' }
  ],
  equipmentModel: [
    { required: true, message: '请选择设备型号', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入租赁数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '租赁数量至少为1', trigger: 'blur' }
  ],
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { type: 'number', min: 0, message: '单价不能为负数', trigger: 'blur' }
  ],
  rentStartDate: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  rentEndDate: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
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

// 设备型号选项映射
const equipmentModels = {
  '挖掘机': [
    { label: 'CAT320D', value: 'CAT320D', price: 800 },
    { label: 'CAT330D', value: 'CAT330D', price: 1000 },
    { label: 'PC200-8', value: 'PC200-8', price: 750 },
    { label: 'PC360-7', value: 'PC360-7', price: 950 }
  ],
  '装载机': [
    { label: 'LG956L', value: 'LG956L', price: 600 },
    { label: 'LG958L', value: 'LG958L', price: 700 },
    { label: 'ZL50GN', value: 'ZL50GN', price: 550 }
  ],
  '推土机': [
    { label: 'SD16', value: 'SD16', price: 900 },
    { label: 'SD22', value: 'SD22', price: 1200 },
    { label: 'TY165-2', value: 'TY165-2', price: 850 }
  ],
  '压路机': [
    { label: 'XS203J', value: 'XS203J', price: 500 },
    { label: 'XS223J', value: 'XS223J', price: 600 },
    { label: 'CC211', value: 'CC211', price: 480 }
  ],
  '起重机': [
    { label: 'QY25K5', value: 'QY25K5', price: 1500 },
    { label: 'QY50KA', value: 'QY50KA', price: 2000 },
    { label: 'RT55E', value: 'RT55E', price: 1800 }
  ],
  '搅拌车': [
    { label: 'HDT5257GJB', value: 'HDT5257GJB', price: 400 },
    { label: 'SY5256GJBDZ', value: 'SY5256GJBDZ', price: 450 },
    { label: 'ZLJ5259GJBJE', value: 'ZLJ5259GJBJE', price: 420 }
  ]
}

// 计算属性
const availableModels = computed(() => {
  return equipmentModels[formData.equipmentType] || []
})

const rentDays = computed(() => {
  if (!formData.rentStartDate || !formData.rentEndDate) return 0
  const start = new Date(formData.rentStartDate)
  const end = new Date(formData.rentEndDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
})

/**
 * 处理设备类型变化
 */
const handleEquipmentTypeChange = () => {
  formData.equipmentModel = ''
  formData.unitPrice = 0
  calculateTotalAmount()
}

/**
 * 处理设备型号变化
 */
const handleEquipmentModelChange = () => {
  const selectedModel = availableModels.value.find(
    model => model.value === formData.equipmentModel
  )
  if (selectedModel) {
    formData.unitPrice = selectedModel.price
    calculateTotalAmount()
  }
}

/**
 * 计算总金额
 */
const calculateTotalAmount = () => {
  const days = rentDays.value
  if (days > 0 && formData.quantity > 0 && formData.unitPrice > 0) {
    formData.totalAmount = days * formData.quantity * formData.unitPrice
  } else {
    formData.totalAmount = 0
  }
}

/**
 * 禁用开始日期
 */
const disabledStartDate = (time) => {
  // 不能选择过去的日期
  return time.getTime() < Date.now() - 8.64e7
}

/**
 * 禁用结束日期
 */
const disabledEndDate = (time) => {
  if (!formData.rentStartDate) return false
  // 结束日期不能早于开始日期
  return time.getTime() < new Date(formData.rentStartDate).getTime()
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
 * 初始化表单数据
 */
const initFormData = () => {
  if (props.order) {
    // 编辑模式，填充现有数据
    Object.assign(formData, {
      customerName: props.order.customerName || '',
      customerPhone: props.order.customerPhone || '',
      contact: props.order.contact || '',
      address: props.order.address || '',
      equipmentType: props.order.equipmentType || '',
      equipmentModel: props.order.equipmentModel || '',
      quantity: props.order.quantity || 1,
      unitPrice: props.order.unitPrice || 0,
      totalAmount: props.order.totalAmount || 0,
      rentStartDate: props.order.rentStartDate ? 
        new Date(props.order.rentStartDate).toISOString().slice(0, 19).replace('T', ' ') : '',
      rentEndDate: props.order.rentEndDate ? 
        new Date(props.order.rentEndDate).toISOString().slice(0, 19).replace('T', ' ') : '',
      remark: props.order.remark || ''
    })
  } else {
    // 新建模式，重置表单
    Object.assign(formData, {
      customerName: '',
      customerPhone: '',
      contact: '',
      address: '',
      equipmentType: '',
      equipmentModel: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      rentStartDate: '',
      rentEndDate: '',
      remark: ''
    })
  }
}

/**
 * 处理提交
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    submitLoading.value = true

    if (isEdit.value) {
      // 更新订单
      await orderStore.updateOrder(props.order.id, formData)
      ElMessage.success('订单更新成功')
    } else {
      // 创建订单
      await orderStore.createOrder(formData)
      ElMessage.success('订单创建成功')
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
    if (error !== 'validation failed') {
      ElMessage.error(isEdit.value ? '订单更新失败' : '订单创建失败')
    }
  } finally {
    submitLoading.value = false
  }
}

/**
 * 处理关闭
 */
const handleClose = () => {
  formRef.value?.clearValidate()
  dialogVisible.value = false
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      nextTick(() => {
        initFormData()
      })
    }
  }
)

// 监听租赁时间变化
watch(
  [() => formData.rentStartDate, () => formData.rentEndDate],
  () => {
    calculateTotalAmount()
  }
)
</script>

<style scoped>
/* 表单样式 */
.order-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 12px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 3px solid var(--primary-color);
}

/* 租赁汇总样式 */
.rent-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-color);
  border-radius: 6px;
  margin-top: 12px;
}

.summary-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.summary-text strong {
  color: var(--text-primary);
  margin: 0 4px;
}

.total-amount {
  color: var(--success-color) !important;
  font-size: 16px;
}

/* 对话框底部样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表单项样式调整 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-textarea__inner) {
  resize: none;
}

/* 滚动条样式 */
.order-form::-webkit-scrollbar {
  width: 6px;
}

.order-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.order-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.order-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rent-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .dialog-footer {
    flex-direction: column;
  }
}
</style>