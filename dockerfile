
FROM grafana/grafana:latest

ENV GF_SECURITY_ADMIN_USER=admin
ENV GF_SECURITY_ADMIN_PASSWORD=admin

COPY dist /var/lib/grafana/plugins/myplugin/

EXPOSE 3000
