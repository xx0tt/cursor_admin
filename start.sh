#!/bin/bash

# 租赁设备管理系统启动脚本
# 
# 使用说明:
# chmod +x start.sh    # 给脚本添加执行权限
# ./start.sh          # 运行脚本

echo "🚀 租赁设备管理系统启动脚本"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js (版本 >= 16.0.0)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ 错误: Node.js 版本过低 (当前: $NODE_VERSION, 需要: >= $REQUIRED_VERSION)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $NODE_VERSION"

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    exit 1
fi

echo "✅ npm 已安装: $(npm -v)"

# 检查是否存在package.json
if [ ! -f "package.json" ]; then
    echo "❌ 错误: package.json 文件不存在"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装项目依赖..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        echo "尝试使用以下命令手动安装:"
        echo "npm install"
        exit 1
    fi
    
    echo "✅ 依赖安装完成"
else
    echo "✅ 项目依赖已存在"
fi

# 显示项目信息
echo ""
echo "📋 项目信息"
echo "================================"
echo "项目名称: 租赁设备管理系统"
echo "技术栈: Vue 3 + Vite + Element Plus"
echo "端口: 3000"
echo "环境: 开发环境"
echo ""

# 显示登录信息
echo "🔑 登录信息"
echo "================================"
echo "管理员账号:"
echo "  用户名: admin"
echo "  密码: 123456"
echo ""
echo "操作员账号:"
echo "  用户名: operator"
echo "  密码: 123456"
echo ""

# 询问是否启动
read -p "是否现在启动开发服务器? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在启动开发服务器..."
    echo "访问地址: http://localhost:3000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================"
    
    # 启动开发服务器
    npm run dev
else
    echo "📝 手动启动命令:"
    echo "npm run dev"
    echo ""
    echo "🌐 访问地址:"
    echo "http://localhost:3000"
    echo ""
    echo "📚 更多信息请查看 README.md"
fi