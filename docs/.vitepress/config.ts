import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EZ Admin NaiveUI",
  description: "基于 Vue 3 + Naive UI 的后台管理系统",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/quick-start' },
      { text: '开发指南', link: '/development' }
    ],

    // 页面目录配置
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: '页面导航' // 自定义目录标题
    },

    sidebar: [
      {
        text: '项目介绍',
        items: [
          { text: '项目概述', link: '/introduction' },
          { text: '技术栈', link: '/tech-stack' },
          { text: '功能特性', link: '/features' }
        ]
      },
      {
        text: '快速开始',
        items: [
          { text: '环境准备', link: '/quick-start' },
          { text: '项目结构', link: '/architecture' },
          { text: '运行项目', link: '/running' }
        ]
      },
      {
        text: '功能模块',
        items: [
          { text: '用户管理', link: '/modules/user' },
          { text: '角色管理', link: '/modules/role' },
          { text: '菜单管理', link: '/modules/menu' },
          { text: '部门管理', link: '/modules/dept' },
          { text: '字典管理', link: '/modules/dict' },
          { text: '日志管理', link: '/modules/log' }
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: 'CRUD 组件', link: '/development/crud' },
          { text: '表单配置', link: '/development/form' },
          { text: '表格配置', link: '/development/table' },
          { text: 'API 调用', link: '/development/api' }
        ]
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
          { text: '日志接口', link: '/api/log' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Caoshenyang/ez-admin-naiveui' }
    ]
  }
})
