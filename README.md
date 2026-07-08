# Floorplan Prototype (React + Konva)

说明：
- 这是一个极简前端原型：表单输入房间（名称、面积），自动布局成矩形平面图，画布支持拖拽，支持导出 PNG。
- 目前为单页面、单层版本，便于快速验证 UX 和自动布局思路。

运行（本地静态）：
1. 安装依赖：
   - npm install
2. 启动（示例使用 http-server，通过 npm start）：
   - npm start
3. 打开浏览器：
   - http://localhost:3000

后续改进建议：
- 支持多层/楼梯模块、门窗和尺寸标注、DXF/IFC 导出。
- 在布局中加入“相邻约束/通道��度/外墙朝向”等评分函数.
