<?php

return [
    // Microservicios internos (URL dentro de la red Docker)
    'auth_service'     => env('AUTH_SERVICE_URL',     'http://auth-service:8000'),
    'reports_service'  => env('REPORTS_SERVICE_URL',  'http://reports-service:8000'),
    'votes_service'    => env('VOTES_SERVICE_URL',    'http://votes-service:8000'),
    'comments_service' => env('COMMENTS_SERVICE_URL', 'http://comments-service:8000'),
];
