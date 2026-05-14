# Film Journal

Film Journal 是一个复古胶片摄影风格的个人内容网站，支持照片管理、相册整理、文章发布和后台管理。

## Tech Stack

- **框架** Next.js 16 (App Router)
- **语言** TypeScript 5
- **样式** Tailwind CSS 4 (`@tailwindcss/postcss`，CSS-first 配置)
- **数据库** PostgreSQL + Prisma 7.7 (`@prisma/adapter-pg`)
- **对象存储** 腾讯云 COS (`cos-nodejs-sdk-v5`)
- **图片处理** sharp (服务端) + Canvas API (客户端)

## Screenshots

### Home

![Film Journal home page](docs/screenshots/home-desktop.png)

### Album Detail

![Film Journal album detail](docs/screenshots/album-detail-desktop.png)

### Photos Grid

![Film Journal photos grid](docs/screenshots/photos-grid-desktop.png)

### Mobile Album View

![Film Journal mobile album view](docs/screenshots/album-mobile.png)

## Features

### 前台

- 首页深色 Hero 首屏，带入场动画
- 照片瀑布流浏览与详情查看
- 相册列表与胶片式相册详情
- 关于页
- 响应式适配

### 后台

- 照片管理：新建、编辑、删除、批量上传、批量删除
- 相册管理：创建、编辑、照片排序、封面设置
- 文章管理：新建、编辑、删除
- 用户管理：创建、编辑、删除、角色分配
- 通用数据表格：分页、搜索、状态筛选、每页条数切换、全选/批量操作

### 图片存储

项目支持两种存储方式，通过环境变量自动切换：

**腾讯云 COS（主用）**

- 客户端直传：通过 STS 临时密钥获取预签名 URL，浏览器直接上传到 COS，不经过服务端
- 自动生成缩略图：客户端 Canvas API 生成 800px 缩略图，与原图并行上传
- 访问代理：`cos://` 内部 URI 经 `/api/local-media` 转为签名 URL 后 302 重定向，不暴露存储桶地址
- 上传流程：选择文件 -> 获取预签名 URL -> Canvas 压缩 -> 并行上传原图+缩略图 -> 注册照片到数据库

**本地存储（备用）**

- 上传到服务端 `/api/admin/local-upload`，由 sharp 处理 HEIC 转换、压缩和缩略图生成
- 通过 `/api/local-media` 从磁盘读取文件

## Routes

### 页面

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/photos` | 照片列表 |
| `/photos/[slug]` | 照片详情 |
| `/albums` | 相册列表 |
| `/albums/[slug]` | 相册详情 |
| `/about` | 关于页 |
| `/login` | 登录页 |
| `/me` | 用户中心 |
| `/me/photos` | 我的照片 |
| `/me/albums` | 我的相册 |
| `/me/settings` | 个人设置 |
| `/admin` | 后台首页 |
| `/admin/photos` | 照片管理 |
| `/admin/photos/new` | 新建照片 |
| `/admin/photos/batch` | 批量操作 |
| `/admin/photos/[id]` | 编辑照片 |
| `/admin/albums` | 相册管理 |
| `/admin/albums/new` | 新建相册 |
| `/admin/albums/[id]` | 相册详情 |
| `/admin/albums/[id]/edit` | 编辑相册 |
| `/admin/journals` | 文章管理 |
| `/admin/journals/new` | 新建文章 |
| `/admin/journals/[id]` | 编辑文章 |
| `/admin/media` | 媒体库 |
| `/admin/users` | 用户管理 |
| `/admin/users/[id]/edit` | 编辑用户 |

### API

| 路径 | 说明 |
|------|------|
| `POST /api/auth/login` | 登录 |
| `POST /api/auth/logout` | 登出 |
| `GET /api/local-media` | 图片访问代理（支持 cos:// 和本地路径） |
| `POST /api/admin/cos/sts` | 生成 COS 预签名上传 URL |
| `POST /api/admin/local-upload` | 本地文件上传 |
| `POST /api/admin/photos/register` | 注册 COS 已上传的照片 |
| `/api/admin/photos` | 照片 CRUD + 批量操作 |
| `/api/admin/albums` | 相册 CRUD + 批量操作 |
| `/api/admin/albums/[id]/photos` | 相册照片管理 |
| `/api/admin/albums/[id]/sort` | 相册照片排序 |
| `/api/admin/journals` | 文章 CRUD + 批量操作 |
| `/api/admin/users` | 用户 CRUD |

## Database

Prisma 模型：

| 模型 | 说明 |
|------|------|
| `Photo` | 照片元数据，含 `imageUrl`、`thumbUrl`、`cosKey`、`storageType` |
| `Album` | 相册，含封面、发布状态、照片计数 |
| `AlbumPhoto` | 相册-照片关联表，负责排序 |
| `Journal` | 文章，含标题、摘要、正文、封面 |
| `User` | 用户，含角色 (`user` / `system_admin`)、密码哈希 |

## Project Structure

```text
app/
  about/                     # 关于页
  admin/                     # 后台管理页面
  albums/                    # 前台相册
  api/
    auth/                    # 登录/登出
    admin/
      cos/sts/               # COS 预签名 URL
      photos/                # 照片 CRUD + 注册
      albums/                # 相册 CRUD + 照片管理
      journals/              # 文章 CRUD
      users/                 # 用户 CRUD
      local-upload/          # 本地文件上传
    local-media/             # 图片访问代理
  login/                     # 登录页
  me/                        # 用户中心
  photos/                    # 前台照片

components/
  admin-*.tsx                # 后台管理组件
  album-*.tsx                # 相册展示组件
  photo-*.tsx                # 照片展示组件
  site-*.tsx                 # 全局布局组件
  cos-upload-photo-modal.tsx # COS 上传弹窗
  upload-photo-*.tsx         # 上传按钮组件

lib/
  prisma.ts                  # Prisma 单例（含 schema 版本检查）
  cos-config.ts              # COS 配置与客户端初始化
  cos-upload.ts              # 客户端 COS 上传逻辑
  cos-utils.ts               # COS 工具函数（签名 URL、key 解析）
  local-media.ts             # 客户端图片 URL 处理
  local-media-server.ts      # 服务端图片处理（sharp）
  client-image.ts            # 客户端图片压缩（Canvas API）
  password.ts                # 密码哈希（scrypt）
  require-admin.ts           # 认证与权限检查

prisma/
  schema.prisma              # 数据库模型定义
  migrations/                # 迁移文件

scripts/
  seed-admin.cjs             # 初始化管理员账号
  import-local-albums.cjs    # 批量导入本地相册
  dedupe-local-imports.cjs   # 清理重复导入
```

## Getting Started

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env`：

```env
# 必填
DATABASE_URL="postgresql://postgres:password@localhost:5432/film_journal?schema=public"

# 腾讯云 COS（不配置则降级为本地存储）
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_BUCKET=your_bucket_name
COS_REGION=ap-guangzhou
COS_APP_ID=your_app_id

# 可选
LOCAL_MEDIA_ROOT="D:\work\film-journal\storage\local-media"
LOCAL_IMPORT_SOURCE_ROOT="D:\workspace\film-journal-img"
```

### 3. 数据库迁移

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. 初始化管理员

```bash
node scripts/seed-admin.cjs
```

默认创建 `admin_0` / `admin123`，角色为 `system_admin`。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`。

## Commands

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建（含类型检查） |
| `npm run lint` | ESLint 检查 |
| `npx prisma migrate dev` | 运行数据库迁移 |
| `npx prisma generate` | 生成 Prisma Client |
| `node scripts/seed-admin.cjs` | 初始化管理员账号 |
| `npm run import:local-albums` | 批量导入本地相册 |
| `npm run dedupe:local-imports` | 清理重复导入 |

## Auth

- 基于 Cookie 的认证：`fj_session`、`fj_user_id`、`fj_user_role`
- 密码使用 scrypt 哈希（16 字节盐 + 64 字节密钥），时序安全比较
- 两种角色：`user`（普通用户）、`system_admin`（管理员）
- `middleware.ts` 保护所有受限制路由，管理员路由额外校验角色
- 登录成功后回跳原目标页面

## Known Limitations

- 文章前台展示链路还没有像照片/相册那样完善
- 删除仍以硬删除为主，没有软删除
- 没有配置测试框架

## Repository

[https://github.com/ooeo163/film-journal](https://github.com/ooeo163/film-journal)
