FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=syrtis-jezero-frontend /frontend/dist/ /usr/share/nginx/html/

EXPOSE 80
