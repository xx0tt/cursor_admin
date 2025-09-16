<template>
  <div class="customer-service-tickets-container page-container">
    <div class="page-header">
      <div class="page-title">客服工单</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          创建工单
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="客服工单功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 客服工单页面 - 开发中
</script>

<style scoped>
.customer-service-tickets-container {
  padding: 20px;
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--card-bg);
  border-radius: 8px;
}
</style>