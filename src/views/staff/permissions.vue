<template>
  <div class="staff-permissions-container page-container">
    <div class="page-header">
      <div class="page-title">权限管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加权限
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="权限管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 权限管理页面 - 开发中
</script>

<style scoped>
.staff-permissions-container {
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
