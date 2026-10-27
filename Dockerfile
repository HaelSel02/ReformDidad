FROM php:8.2-apache

# Extensiones que usa el proyecto: mysqli (BBDD) y gd (dompdf). mbstring y dom ya vienen incluidas.
RUN apt-get update && apt-get install -y --no-install-recommends libpng-dev libjpeg-dev libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd mysqli \
    && a2enmod rewrite

COPY web/ /var/www/html/
RUN chown -R www-data:www-data /var/www/html/img_reformas /var/www/html/reportes_reformas
