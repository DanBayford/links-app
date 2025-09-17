#!/bin/sh

echo 'Building Tailwind files'
tailwindcss -i ./frontend/input.css -o ./core/static/css/styles.css --minify