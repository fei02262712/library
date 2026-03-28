<template>
  <div class="login-container">
    <el-card class="login-card" shadow="always">
      <h2 style="text-align: center; margin-bottom: 30px;">图书管理系统</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%;">登录</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center; color: #999; margin-top: 20px;">
        测试账号：admin / 123456
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  // 简单验证：账号 admin，密码 123456
  if (form.value.username === 'admin' && form.value.password === '123456') {
    // 保存登录状态
    localStorage.setItem('isLoggedIn', 'true')
    ElMessage.success('登录成功')
    // 跳转到图书列表页
    router.push('/books')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
</style>