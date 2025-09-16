<template>
  <div class="staff-roles-container page-container">
    <div class="page-header">
      <div class="page-title">角色管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加角色
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="角色管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 角色管理页面 - 开发中
</script>

<style scoped>
.staff-roles-container {
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