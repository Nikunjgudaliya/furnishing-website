<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel React Inertia</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    @inertia
</body>
</html>
