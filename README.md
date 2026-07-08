# Floorplan Prototype (React + Konva)

说明：
- 这是一个极简前端原型：表单输入房间（名称、面积），自动布局成矩形平面图，画布支持拖拽，支持导出 PNG。
- 使用 Vite 作为开发服务器（推荐），也保留了静态 public/ 目录用于简单静态托管。

运行（开发模式）：
1. 安装依赖：
   - npm install
2. 启动开发服务器：
   - npm run dev
3. 打开浏览器：
   - http://localhost:5173 (Vite 默认端口)

或（仅静态测试 public/）：
- npm start （使用 http-server 静态服务 public/，但不支持模块打包）

后续改进建议：
- 支持多层/楼梯模块、门窗和尺寸标注、DXF/IFC 导出。
- 在布局中加入“相邻约束/通道宽度/外墙朝向”等评分函数。
