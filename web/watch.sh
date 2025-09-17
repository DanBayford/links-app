#!/bin/sh

echo 'Watching Tailwind files'
tailwindcss -i ./frontend/input.css -o ./core/static/css/styles.css --watch