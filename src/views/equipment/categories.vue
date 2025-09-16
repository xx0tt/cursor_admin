<template>
  <div class="equipment-categories-container page-container">
    <div class="page-header">
      <div class="page-title">设备分类</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加分类
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="设备分类管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 设备分类管理页面 - 开发中
</script>

<style scoped>
.equipment-categories-container {
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