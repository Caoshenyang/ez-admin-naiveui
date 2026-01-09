import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'EZ Admin NaiveUI',
  description: '基于 Vue 3 + Naive UI 的后台管理系统',
  base: '/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/quick-start' },
      { text: '开发指南', link: '/development' },
      { text: '开发日志', link: '/logs/' },
    ],

    // 页面目录配置
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: '页面导航', // 自定义目录标题
    },

    sidebar: {
      '/': [
        {
          text: '项目介绍',
          items: [
            { text: '项目概述', link: '/introduction' },
            { text: '技术栈', link: '/tech-stack' },
            { text: '功能特性', link: '/features' },
          ],
        },
        {
          text: '快速开始',
          items: [
            { text: '环境准备', link: '/quick-start' },
            { text: '项目结构', link: '/architecture' },
            { text: '运行项目', link: '/running' },
          ],
        },
        {
          text: '功能模块',
          items: [
            { text: '用户管理', link: '/modules/user' },
            { text: '角色管理', link: '/modules/role' },
            { text: '菜单管理', link: '/modules/menu' },
            { text: '部门管理', link: '/modules/dept' },
            { text: '字典管理', link: '/modules/dict' },
            { text: '日志管理', link: '/modules/log' },
          ],
        },
        {
          text: '开发指南',
          items: [
            { text: '图片使用指南', link: '/image-usage-guide' },
            { text: '类型命名规范', link: '/types-naming-convention' },
            { text: 'CRUD 组件', link: '/development/crud' },
            { text: '表单配置', link: '/development/form' },
            { text: '表格配置', link: '/development/table' },
            { text: 'API 调用', link: '/development/api' },
          ],
        },
        {
          text: 'API 文档',
          items: [
            { text: '用户接口', link: '/api/user' },
            { text: '角色接口', link: '/api/role' },
            { text: '菜单接口', link: '/api/menu' },
            { text: '部门接口', link: '/api/dept' },
            { text: '字典接口', link: '/api/dict' },
            { text: '文件接口', link: '/api/file' },
            { text: '日志接口', link: '/api/log' },
          ],
        },
      ],
      '/logs/': [
        {
          text: '开发日志',
          items: [
            { text: '日志概览', link: '/logs/' },
            {
              text: '开发时间线',
              items: [
                { text: '2025年1月9日 - 项目起步', link: '/logs/timeline/2025-01-09' },
                { text: '2025年1月10日 - 组件开发深入', link: '/logs/timeline/2025-01-10' },
                { text: '2025年1月11日 - API 接口设计', link: '/logs/timeline/2025-01-11' },
              ],
            },
            { text: '架构设计思考', link: '/logs/architecture' },
            { text: '项目进度追踪', link: '/logs/progress' },
            { text: '心得体会', link: '/logs/reflections' },
            {
              text: '开发随笔',
              items: [
                { text: '随笔集', link: '/logs/essays/' },
                { text: '组件化架构的演进', link: '/logs/essays/component-architecture' },
                { text: '状态管理的权衡', link: '/logs/essays/state-management' },
                { text: 'TypeScript 类型编程的实践', link: '/logs/essays/typescript-practice' },
                { text: '文档驱动开发', link: '/logs/essays/documentation-driven' },
              ],
            },
            { text: '未来展望', link: '/logs/future' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Caoshenyang/ez-admin-naiveui' }],
  },
})
