<template>
  <div class="finance-reports-container page-container">
    <div class="page-header">
      <div class="page-title">财务报表</div>
      <div class="header-actions">
        <el-button type="primary" :icon="DataAnalysis">
          生成报表
        </el-button>
        <el-button :icon="Download">
          导出报表
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="财务报表功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 财务报表页面 - 开发中
</script>

<style scoped>
.finance-reports-container {
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
