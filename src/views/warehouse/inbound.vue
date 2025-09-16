<template>
  <div class="warehouse-inbound-container page-container">
    <div class="page-header">
      <div class="page-title">入库管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          新增入库
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="入库管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 入库管理页面 - 开发中
</script>

<style scoped>
.warehouse-inbound-container {
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