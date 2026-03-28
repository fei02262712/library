<template>
  <div style="max-width: 800px; margin: 50px auto; padding: 20px;">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0;">📖 图书详情</h2>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>

      <div v-loading="loading">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="分类">
            {{ bookDetail.category || '未分类' }}
          </el-descriptions-item>
          <el-descriptions-item label="书名">
            {{ bookDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="作者">
            {{ bookDetail.author }}
          </el-descriptions-item>
          <el-descriptions-item label="图书ID">
            {{ bookDetail.id }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBooks } from '../api/book'
import { ElMessage } from 'element-plus'

const route = useRoute()   // 获取路由参数
const router = useRouter() // 用于返回上一页

const bookDetail = ref({})
const loading = ref(false)

// 获取图书详情
const fetchBookDetail = async () => {
  const bookId = Number(route.params.id)  // 从 URL 获取 id，转成数字
  loading.value = true
  try {
    const books = await getBooks()
    const found = books.find(b => b.id === bookId)
    if (found) {
      bookDetail.value = found
    } else {
      ElMessage.error('图书不存在')
      router.push('/books')
    }
  } catch (error) {
    console.error('加载失败', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 返回列表页
const goBack = () => {
  router.push('/books')
}

onMounted(() => {
  fetchBookDetail()
})
</script>