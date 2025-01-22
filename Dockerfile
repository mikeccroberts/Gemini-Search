# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 删除默认的 Nginx 网站内容
RUN rm -rf /usr/share/nginx/html/*

# 将构建的前端文件复制到 Nginx 默认的公开目录
COPY dist/ /usr/share/nginx/html/

# 复制自定义的 Nginx 配置文件（如果有的话）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 的 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
