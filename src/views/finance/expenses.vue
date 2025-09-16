<template>
  <div class="finance-expenses-container page-container">
    <div class="page-header">
      <div class="page-title">支出统计</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加支出记录
        </el-button>
        <el-button :icon="Download">
          导出报表
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="支出统计功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 支出统计页面 - 开发中
</script>

<style scoped>
.finance-expenses-container {
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