<template>
  <div class="warehouse-inventory-container page-container">
    <div class="page-header">
      <div class="page-title">库存管理</div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">
          添加库存
        </el-button>
        <el-button :icon="Download">
          导出数据
        </el-button>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="库存管理功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 库存管理页面 - 开发中
</script>

<style scoped>
.warehouse-inventory-container {
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