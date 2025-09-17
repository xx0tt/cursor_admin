<template>
  <div class="aftersale-detail-container page-container">
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="$router.go(-1)">
          返回
        </el-button>
        <div class="page-title">工单详情</div>
      </div>
    </div>

    <div class="content-placeholder">
      <el-empty description="售后工单详情功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 售后工单详情页面 - 开发中
</script>

<style scoped>
.aftersale-detail-container {
  padding: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
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
