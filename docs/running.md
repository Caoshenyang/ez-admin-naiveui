# 运行项目

## 开发环境运行

### 启动前端开发服务器

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

项目将在 `http://localhost:5173` 启动。

### 启动文档开发服务器

```bash
# 启动文档开发服务器
pnpm docs:dev
```

文档将在 `http://localhost:4173` 启动。

## 生产环境部署

### 构建项目

```bash
# 构建前端应用
pnpm build

# 构建文档
pnpm docs:build
```

### 部署方式

#### Nginx 部署

```nginx
# /etc/nginx/sites-available/ez-admin-naiveui

server {
    listen 80;
    server_name your-domain.com;

    # 前端应用
    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    image: your-backend-image
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
```

## 环境配置

### 环境变量

创建不同的环境配置文件：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=EZ Admin NaiveUI (Dev)

# .env.production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=EZ Admin NaiveUI
```

### 后端接口要求

前端项目期望的后端 API 格式：

```typescript
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": { /* 响应数据 */ }
}

// 错误响应
{
  "code": 400,
  "message": "参数错误",
  "data": null
}

// 分页响应
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],     // 数据列表
    "total": 100,      // 总记录数
    "pageNum": 1,      // 当前页码
    "pageSize": 10,    // 页大小
    "pages": 10        // 总页数
  }
}
```

## 开发调试

### 浏览器开发工具

- **Vue DevTools**: 调试 Vue 组件状态
- **Network**: 查看网络请求
- **Console**: 查看控制台日志

### 代码调试

```typescript
// 在组件中添加调试信息
const debugUser = (user: UserListVO) => {
  console.log('Current user:', user)
  debugger // 设置断点
}
```

### 性能监控

```typescript
// 性能监控
const measurePerformance = () => {
  const start = performance.now()
  // 执行操作
  loadUserList()
  const end = performance.now()
  console.log(`Operation took ${end - start} milliseconds.`)
}
```

## 常见问题

### 端口占用

```bash
# 查看端口占用
netstat -ano | findstr :5173

# 杀死进程 (Windows)
taskkill /PID <PID> /F

# 杀死进程 (Linux/Mac)
kill -9 <PID>
```

### 依赖问题

```bash
# 清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 构建失败

```bash
# 检查 TypeScript 错误
pnpm type-check

# 检查 ESLint 错误
pnpm lint

# 清理缓存重新构建
pnpm clean-build
```

### 路由问题

如果遇到路由 404 问题，确保 Nginx 配置正确：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 监控和日志

### 前端错误监控

```typescript
// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
  // 发送错误到监控服务
  reportError(err, { instance, info })
}
```

### 性能监控

```typescript
// 页面加载性能
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0]
  console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart)
})
```

## 部署检查清单

- [ ] 环境变量配置正确
- [ ] API 地址配置正确
- [ ] HTTPS 证书配置
- [ ] 静态资源缓存策略
- [ ] 错误页面配置
- [ ] 日志收集配置
- [ ] 监控告警配置
