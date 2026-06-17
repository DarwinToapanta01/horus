FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git curl libpq-dev unzip zip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

CMD ["sh", "-c", "php artisan key:generate --force && until php artisan migrate --force 2>/dev/null; do echo 'Esperando BD...'; sleep 3; done && php artisan serve --host=0.0.0.0 --port=8000"]
