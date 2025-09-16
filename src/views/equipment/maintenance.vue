<template>
  <div class="equipment-maintenance-container page-container">
    <div class="page-header">
      <div class="page-title">维护记录</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加维护记录
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="设备维护记录功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 设备维护记录页面 - 开发中
</script>

<style scoped>
.equipment-maintenance-container {
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