FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git curl unzip zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

# El gateway no tiene BD, solo genera la key y arranca
CMD ["sh", "-c", "php artisan key:generate --force && php artisan serve --host=0.0.0.0 --port=8000"]
