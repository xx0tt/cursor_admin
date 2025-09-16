<template>
  <div class="staff-list-container page-container">
    <div class="page-header">
      <div class="page-title">员工管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加员工
        </el-button>
        <el-button :icon="Download">
          导出数据
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="员工管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 员工管理页面 - 开发中
</script>

<style scoped>
.staff-list-container {
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