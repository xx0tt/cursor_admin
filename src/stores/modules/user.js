import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户状态管理
 * 管理用户登录状态、用户信息、权限等
 */
export const useUserStore = defineStore('user', () => {
  // 状态定义
  const userInfo = ref({
    id: null,
    username: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: '',
    permissions: [],
    department: '',
    position: '',
    status: 'active',
    lastLoginTime: null,
    createTime: null
  })

  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const hasPermission = computed(() => (permission) => {
    return userInfo.value.permissions.includes(permission) || 
           userInfo.value.role === 'admin'
  })

  /**
   * 用户登录
   * @param {Object} loginForm - 登录表单数据
   * @returns {Promise} 登录结果
   */
  const login = async (loginForm) => {
    try {
      // 这里应该调用登录API
      // const response = await api.login(loginForm)
      
      // 模拟登录响应
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: loginForm.username,
          name: '系统管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: '',
          role: 'admin',
          permissions: [
            'dashboard:view',
            'order:view', 'order:create', 'order:edit', 'order:delete',
            'equipment:view', 'equipment:create', 'equipment:edit', 'equipment:delete',
            'warehouse:view', 'warehouse:create', 'warehouse:edit', 'warehouse:delete',
            'staff:view', 'staff:create', 'staff:edit', 'staff:delete',
            'finance:view', 'finance:create', 'finance:edit', 'finance:delete',
            'aftersale:view', 'aftersale:create', 'aftersale:edit', 'aftersale:delete',
            'customer-service:view', 'customer-service:create', 'customer-service:edit'
          ],
          department: '技术部',
          position: '系统管理员',
          status: 'active',
          lastLoginTime: new Date(),
          createTime: new Date('2023-01-01')
        }
      }

      // 保存用户信息和token
      setToken(mockResponse.token, mockResponse.refreshToken)
      setUserInfo(mockResponse.userInfo)

      return mockResponse
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      // 这里应该调用登出API
      // await api.logout()
      
      // 清除本地存储的用户信息
      clearUserInfo()
      
      return true
    } catch (error) {
      console.error('登出失败:', error)
      // 即使API调用失败，也要清除本地信息
      clearUserInfo()
      throw error
    }
  }

  /**
   * 刷新token
   */
  const refreshAccessToken = async () => {
    try {
      // 这里应该调用刷新token的API
      // const response = await api.refreshToken(refreshToken.value)
      
      // 模拟刷新token响应
      const mockResponse = {
        token: 'new-jwt-token-' + Date.now(),
        refreshToken: 'new-refresh-token-' + Date.now()
      }

      setToken(mockResponse.token, mockResponse.refreshToken)
      return mockResponse.token
    } catch (error) {
      console.error('刷新token失败:', error)
      // token刷新失败，清除用户信息并跳转到登录页
      clearUserInfo()
      throw error
    }
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    try {
      // 这里应该调用获取用户信息的API
      // const response = await api.getUserInfo()
      
      // 如果已有用户信息，直接返回
      if (userInfo.value.id) {
        return userInfo.value
      }

      // 模拟获取用户信息响应
      const mockUserInfo = {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: '',
        role: 'admin',
        permissions: [
          'dashboard:view',
          'order:view', 'order:create', 'order:edit', 'order:delete',
          'equipment:view', 'equipment:create', 'equipment:edit', 'equipment:delete',
          'warehouse:view', 'warehouse:create', 'warehouse:edit', 'warehouse:delete',
          'staff:view', 'staff:create', 'staff:edit', 'staff:delete',
          'finance:view', 'finance:create', 'finance:edit', 'finance:delete',
          'aftersale:view', 'aftersale:create', 'aftersale:edit', 'aftersale:delete',
          'customer-service:view', 'customer-service:create', 'customer-service:edit'
        ],
        department: '技术部',
        position: '系统管理员',
        status: 'active',
        lastLoginTime: new Date(),
        createTime: new Date('2023-01-01')
      }

      setUserInfo(mockUserInfo)
      return mockUserInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   * @param {Object} newUserInfo - 新的用户信息
   */
  const updateUserInfo = async (newUserInfo) => {
    try {
      // 这里应该调用更新用户信息的API
      // const response = await api.updateUserInfo(newUserInfo)
      
      // 更新本地用户信息
      Object.assign(userInfo.value, newUserInfo)
      
      // 保存到localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      
      return userInfo.value
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }

  /**
   * 修改密码
   * @param {Object} passwordForm - 密码表单数据
   */
  const changePassword = async (passwordForm) => {
    try {
      // 这里应该调用修改密码的API
      // const response = await api.changePassword(passwordForm)
      
      // 模拟修改密码成功
      return { message: '密码修改成功' }
    } catch (error) {
      console.error('修改密码失败:', error)
      throw error
    }
  }

  /**
   * 设置token
   * @param {string} newToken - 新的访问token
   * @param {string} newRefreshToken - 新的刷新token
   */
  const setToken = (newToken, newRefreshToken) => {
    token.value = newToken
    refreshToken.value = newRefreshToken
    
    // 保存到localStorage
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  /**
   * 设置用户信息
   * @param {Object} info - 用户信息对象
   */
  const setUserInfo = (info) => {
    Object.assign(userInfo.value, info)
    // 保存到localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  /**
   * 清除用户信息
   */
  const clearUserInfo = () => {
    userInfo.value = {
      id: null,
      username: '',
      name: '',
      email: '',
      phone: '',
      avatar: '',
      role: '',
      permissions: [],
      department: '',
      position: '',
      status: 'active',
      lastLoginTime: null,
      createTime: null
    }
    token.value = ''
    refreshToken.value = ''
    
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
  }

  /**
   * 初始化用户信息
   * 从localStorage恢复用户信息
   */
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo)
        setUserInfo(parsedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUserInfo()
      }
    }
  }

  // 初始化时恢复用户信息
  initUserInfo()

  return {
    // 状态
    userInfo,
    token,
    refreshToken,
    
    // 计算属性
    isLoggedIn,
    hasPermission,
    
    // 方法
    login,
    logout,
    refreshAccessToken,
    getUserInfo,
    updateUserInfo,
    changePassword,
    setToken,
    setUserInfo,
    clearUserInfo,
    initUserInfo
  }
})
