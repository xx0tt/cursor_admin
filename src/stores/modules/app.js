import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用状态管理
 * 管理应用的全局状态，如侧边栏状态、主题设置等
 */
export const useAppStore = defineStore('app', () => {
  // 状态定义
  const sidebarCollapsed = ref(false) // 侧边栏是否折叠
  const theme = ref('light') // 主题模式：light/dark
  const language = ref('zh-CN') // 语言设置
  const pageLoading = ref(false) // 页面加载状态
  const breadcrumbVisible = ref(true) // 面包屑是否可见
  const tagsViewVisible = ref(false) // 标签页是否可见

  // 设备和屏幕相关
  const device = ref('desktop') // 设备类型：desktop/tablet/mobile
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)

  /**
   * 切换侧边栏状态
   */
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    // 保存到localStorage
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
  }

  /**
   * 设置侧边栏状态
   * @param {boolean} collapsed - 是否折叠
   */
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('sidebarCollapsed', collapsed)
  }

  /**
   * 切换主题
   * @param {string} newTheme - 主题名称
   */
  const setTheme = (newTheme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  /**
   * 设置语言
   * @param {string} lang - 语言代码
   */
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }

  /**
   * 设置页面加载状态
   * @param {boolean} loading - 加载状态
   */
  const setPageLoading = (loading) => {
    pageLoading.value = loading
  }

  /**
   * 更新屏幕尺寸
   * @param {number} width - 屏幕宽度
   * @param {number} height - 屏幕高度
   */
  const updateScreenSize = (width, height) => {
    screenWidth.value = width
    screenHeight.value = height
    
    // 根据屏幕宽度判断设备类型
    if (width <= 768) {
      device.value = 'mobile'
      // 移动端自动折叠侧边栏
      setSidebarCollapsed(true)
    } else if (width <= 1024) {
      device.value = 'tablet'
    } else {
      device.value = 'desktop'
    }
  }

  /**
   * 设置面包屑可见性
   * @param {boolean} visible - 是否可见
   */
  const setBreadcrumbVisible = (visible) => {
    breadcrumbVisible.value = visible
    localStorage.setItem('breadcrumbVisible', visible)
  }

  /**
   * 设置标签页可见性
   * @param {boolean} visible - 是否可见
   */
  const setTagsViewVisible = (visible) => {
    tagsViewVisible.value = visible
    localStorage.setItem('tagsViewVisible', visible)
  }

  /**
   * 初始化应用设置
   * 从localStorage恢复设置
   */
  const initAppSettings = () => {
    // 恢复侧边栏状态
    const savedSidebarState = localStorage.getItem('sidebarCollapsed')
    if (savedSidebarState !== null) {
      sidebarCollapsed.value = savedSidebarState === 'true'
    }

    // 恢复主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // 恢复语言设置
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      language.value = savedLanguage
    }

    // 恢复面包屑设置
    const savedBreadcrumb = localStorage.getItem('breadcrumbVisible')
    if (savedBreadcrumb !== null) {
      breadcrumbVisible.value = savedBreadcrumb === 'true'
    }

    // 恢复标签页设置
    const savedTagsView = localStorage.getItem('tagsViewVisible')
    if (savedTagsView !== null) {
      tagsViewVisible.value = savedTagsView === 'true'
    }

    // 初始化屏幕尺寸
    updateScreenSize(window.innerWidth, window.innerHeight)

    // 监听屏幕尺寸变化
    window.addEventListener('resize', () => {
      updateScreenSize(window.innerWidth, window.innerHeight)
    })
  }

  /**
   * 重置应用设置
   */
  const resetAppSettings = () => {
    sidebarCollapsed.value = false
    theme.value = 'light'
    language.value = 'zh-CN'
    breadcrumbVisible.value = true
    tagsViewVisible.value = false
    
    // 清除localStorage
    localStorage.removeItem('sidebarCollapsed')
    localStorage.removeItem('theme')
    localStorage.removeItem('language')
    localStorage.removeItem('breadcrumbVisible')
    localStorage.removeItem('tagsViewVisible')
    
    // 重新应用默认主题
    setTheme('light')
  }

  return {
    // 状态
    sidebarCollapsed,
    theme,
    language,
    pageLoading,
    breadcrumbVisible,
    tagsViewVisible,
    device,
    screenWidth,
    screenHeight,
    
    // 方法
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    setLanguage,
    setPageLoading,
    updateScreenSize,
    setBreadcrumbVisible,
    setTagsViewVisible,
    initAppSettings,
    resetAppSettings
  }
})
