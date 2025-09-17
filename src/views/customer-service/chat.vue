<template>
  <div class="customer-service-chat-container page-container">
    <div class="page-header">
      <div class="page-title">在线客服</div>
    </div>

    <div class="content-placeholder">
      <el-empty description="在线客服功能开发中...">
        <el-button type="primary" @click="$router.go(-1)">
          返回上页
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
// 在线客服页面 - 开发中
</script>

<style scoped>
.customer-service-chat-container {
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
