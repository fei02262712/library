<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBooks, addBook, deleteBook, updateBook } from '../api/book'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 数据
const books = ref([])
const loading = ref(false)

// 添加表单
const form = ref({
  name: '',
  author: '',
  category: ''
})
// 分类选项
const categories = [
  { value: '文学', label: '文学' },
  { value: '科技', label: '科技' },
  { value: '艺术', label: '艺术' }
]
// 搜索关键词
const searchKeyword = ref('')
const selectedCategory = ref('')

// 编辑弹窗
const showEditDialog = ref(false)
const editForm = ref({ id: null, name: '', author: '' })

// 分页
const currentPage = ref(1)
const pageSize = ref(5)

// 加载图书列表
const loadBooks = async () => {
  loading.value = true
  try {
    const res = await getBooks()
    books.value = res
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

// 添加图书
const handleAdd = async () => {
  if (!form.value.name || !form.value.author) {
    ElMessage.warning('请填写书名和作者')
    return
  }
  await addBook(form.value)
  form.value = { name: '', author: '' }
  loadBooks()
  ElMessage.success('添加成功')
}

// 删除图书
const handleDelete = async (id) => {
  ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteBook(id)
    loadBooks()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 打开编辑弹窗
const openEditDialog = (book) => {
  editForm.value = { ...book }
  showEditDialog.value = true
}

// 保存编辑
const handleEdit = async () => {
  if (!editForm.value.name || !editForm.value.author) {
    ElMessage.warning('请填写完整')
    return
  }
  await updateBook(editForm.value.id, {
    name: editForm.value.name,
    author: editForm.value.author
  })
  showEditDialog.value = false
  loadBooks()
  ElMessage.success('修改成功')
}
// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/books/${id}`)
}
// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
    ElMessage.success('已退出登录')
  }).catch(() => {})
}

// 根据搜索关键词筛选图书
const filteredBooks = () => {
  let result = books.value
  if (searchKeyword.value) {
    result = result.filter(book =>
        book.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (selectedCategory.value) {
    result = result.filter(book => book.category === selectedCategory.value)
  }
  return result
}

// 分页后的数据
const paginatedBooks = () => {
  const filtered = filteredBooks()
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
}

// 总条数
const totalCount = () => {
  return filteredBooks().length
}

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page
}

// 页面加载时获取数据
onMounted(() => {
  loadBooks()
})
</script>

<template>
  <div class="books-container">
  <div style="max-width: 1000px; margin: 50px auto; padding: 20px;">
    <el-card>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
      <h1 style="margin: 0;">📚 图书管理系统</h1>
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </div>

    <!-- 搜索和添加区域 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="12">
        <el-input
            v-model="searchKeyword"
            placeholder="按书名搜索..."
            clearable
            @clear="searchKeyword = ''"
        />
      </el-col>
      <el-col :span="8">
      <el-select v-model="selectedCategory" placeholder="按分类筛选" clearable style="width: 100%;">
        <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
        />
      </el-select>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <el-button type="primary" @click="handleAdd" style="margin-left: 10px;">添加图书</el-button>
      </el-col>
    </el-row>

    <!-- 添加图书表单 -->
    <el-row :gutter="20" style="margin-bottom: 30px;">
      <el-col :span="10">
        <el-input v-model="form.name" placeholder="书名" />
      </el-col>
      <el-col :span="10">
        <el-input v-model="form.author" placeholder="作者" />
      </el-col><el-col :span="10">
      <el-select v-model="form.category" placeholder="选择分类" style="width: 100%;">
        <el-option
            v-for="cat in categories"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
        />
      </el-select>
    </el-col>

      <el-col :span="4">
        <el-button type="success" @click="handleAdd" style="width: 100%;">确认添加</el-button>
      </el-col>
    </el-row>

    <!-- 图书列表表格 -->
    <el-table :data="paginatedBooks()" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="name" label="书名" min-width="200" />
      <el-table-column prop="author" label="作者" min-width="150" />
      <el-table-column prop="category" label="分类" min-width="100" />
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button
              type="info"
              size="small"
              link
              @click="goToDetail(row.id)"
          >
            详情
          </el-button>
          <el-button
              type="primary"
              size="small"
              link
              @click="openEditDialog(row)"
          >
            编辑
          </el-button>
          <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalCount()"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!loading && totalCount() === 0" description="暂无图书，请添加" />

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showEditDialog" title="编辑图书" width="400px">
      <el-form :model="editForm">
        <el-form-item label="书名">
          <el-input v-model="editForm.name" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="editForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.category" placeholder="请选择分类" style="width: 100%;">
            <el-option
                v-for="cat in categories"
                :key="cat.value"
                :label="cat.label"
                :value="cat.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
    </el-card>
  </div>
  </div>
</template>
<style scoped>
.books-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
}
</style>