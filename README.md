# Film Journal

Film Journal 是一个偏复古胶片摄影风格的个人内容网站原型，当前已经完成前台展示、最小登录流和后台内容管理第一版。

项目从 0 开始搭建，当前技术栈为：

- `Next.js 16`
- `TypeScript`
- `Tailwind CSS`
- `PostgreSQL`
- `Prisma`

当前目标不是只做静态展示页，而是逐步演进成一个可以持续维护的摄影内容平台，包括照片、相册、后台管理，以及后续的正式认证、对象存储和部署能力。

## Current Status

当前仓库已经完成的核心部分：

- 首页深色 Hero 首屏
- 前台照片列表与照片详情
- 前台相册列表与胶片式相册详情
- 关于页
- 最小登录流与用户中心骨架
- 后台照片管理
- 后台相册管理
- 后台文章管理
- 本地图片上传与本地相册导入
- 后台通用 Grid 第一版

当前后台已经支持：

- 新建、编辑、删除
- 批量上传照片
- 批量删除
- 分页
- 搜索
- 状态筛选
- 每页条数切换
- 当前页全选 / 清空选择

## Screens / Routes

当前主要页面：

- `/` 首页
- `/photos` 照片列表
- `/photos/[slug]` 照片详情
- `/albums` 相册列表
- `/albums/[slug]` 相册详情
- `/about` 关于页
- `/login` 登录页
- `/me` 用户中心
- `/me/photos`
- `/me/albums`
- `/me/settings`
- `/admin` 后台首页
- `/admin/photos`
- `/admin/photos/new`
- `/admin/photos/batch`
- `/admin/photos/[id]`
- `/admin/albums`
- `/admin/albums/new`
- `/admin/albums/[id]`
- `/admin/albums/[id]/edit`
- `/admin/journals`
- `/admin/journals/new`
- `/admin/journals/[id]`
- `/admin/media`

说明：

- 受保护页面默认需要登录后访问
- 当前最小登录流登录成功后会回跳原目标页面

## Tech Notes

### Database

当前 Prisma 模型包括：

- `Photo`
- `Album`
- `AlbumPhoto`
- `Journal`
- `User`

其中：

- `Photo` 保存单张照片元数据
- `Album` 保存相册信息
- `AlbumPhoto` 负责相册和照片的关联与排序
- `Journal` 负责后台文章内容
- `User` 负责当前最小登录流

### Local Media

当前图片文件不存数据库，数据库只存 URL / 路径 / 元数据。

项目自己的本地附件目录：

```text
storage/local-media
```

当前本地图片访问通过：

```text
/api/local-media?path=...
```

这意味着：

- 本地导入的历史图片会被复制到项目自己的附件目录
- 浏览器上传的图片也会保存到项目自己的附件目录
- 后续切换到腾讯云 COS 时，主要改的是存储实现和 URL 来源，不需要推翻数据库结构

## Project Structure

```text
app/
  about/
  admin/
  albums/
  api/
  login/
  me/
  photos/

components/
  admin-*.tsx
  album-*.tsx
  photo-*.tsx
  site-*.tsx

lib/
  prisma.ts
  local-media.ts
  local-media-server.ts

prisma/
  schema.prisma
  migrations/

scripts/
  import-local-albums.cjs
  dedupe-local-imports.cjs
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

创建 `.env`，至少包含：

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/film_journal?schema=public"
```

可选：

```env
LOCAL_MEDIA_ROOT="D:\\work\\film-journal\\storage\\local-media"
LOCAL_IMPORT_SOURCE_ROOT="D:\\workspace\\film-journal-img"
```

### 3. Apply database migrations

```bash
npx prisma migrate dev
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start development server

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

## Useful Commands

启动开发环境：

```bash
npm run dev
```

代码检查：

```bash
npm run lint
```

生产构建检查：

```bash
npm run build
```

导入本地相册：

```bash
npm run import:local-albums
```

清理历史重复导入：

```bash
npm run dedupe:local-imports
```

## Login

当前登录流是开发期最小版本：

- 只按用户名或邮箱检查用户是否存在
- 当前还没有正式密码校验
- 当前还没有正式 session 表和权限模型

登录页提示的测试账号格式：

- `admin`
- `admin@filmjournal.local`

如果数据库里还没有用户，需要先插入一条 `User` 记录。

## Development Workflow

当前比较推荐的开发顺序：

1. 完成功能
2. 本地验证页面
3. 运行 `npm run lint`
4. 运行 `npm run build`
5. 再提交 Git

## Known Limitations

当前还存在这些已知限制：

- 登录仍是最小版本，还没有密码哈希和正式权限
- `<img>` 还没有完全切到 `next/image`
- 文章前台展示链路还没有像照片 / 相册那样完善
- 删除当前仍以硬删除为主
- 图片还没有缩略图 / 中图 / 原图多尺寸体系
- 当前仍使用本地文件存储，尚未切腾讯云 COS

## Next Steps

下一步建议优先继续这些方向：

1. 后台 Grid 增加批量发布 / 下架
2. 后台 Grid 增加排序
3. 增加软删除与回收站
4. 增加操作日志
5. 升级正式登录认证
6. 增加图片多尺寸处理
7. 抽象存储层并接入腾讯云 COS
8. 完成 Linux / Nginx / HTTPS 部署链路

## Repository

GitHub:

[https://github.com/ooeo163/film-journal](https://github.com/ooeo163/film-journal)
