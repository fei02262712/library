// 本地存储的 key
const STORAGE_KEY = 'library_books'
// 默认数据
// 默认数据
const defaultBooks = [
    { id: 1, name: 'Vue.js实战', author: '张小明', category: '科技' },
    { id: 2, name: 'JavaScript高级程序设计', author: '李华', category: '科技' },
    { id: 3, name: '三体', author: '刘慈欣', category: '文学' }
]
// 从 localStorage 读取数据
const loadFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        return JSON.parse(stored)
    }
    return defaultBooks
}

// 保存到 localStorage
const saveToStorage = (books) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

// 当前数据
let mockBooks = loadFromStorage()

// 获取图书列表
export const getBooks = () => {
    return Promise.resolve([...mockBooks])
}

// 添加图书
export const addBook = (book) => {
    const newBook = { ...book, id: Date.now() }
    mockBooks.push(newBook)
    saveToStorage(mockBooks)
    return Promise.resolve(newBook)
}

// 删除图书
export const deleteBook = (id) => {
    mockBooks = mockBooks.filter(b => b.id !== id)
    saveToStorage(mockBooks)
    return Promise.resolve(id)
}

// 编辑图书
export const updateBook = (id, updatedBook) => {
    const index = mockBooks.findIndex(b => b.id === id)
    if (index !== -1) {
        mockBooks[index] = { ...mockBooks[index], ...updatedBook, id }
        saveToStorage(mockBooks)
        return Promise.resolve(mockBooks[index])
    }
    return Promise.reject(new Error('图书不存在'))
}