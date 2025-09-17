# Django / Docker Template

A simple Django template running in Docker, with seperate configs for development and production

Note both Dockerfiles execute an `entrypoint` script on container startup which can be used to run other commands (ie `collectstatic` for production containers).

## Development libraries

- django-debug-toolbar

## Production libraries

- gunicorn
- whitenoise

## Custom user model

The app uses a custom user model so that an email is the user identifier rather than a username

## Useful Docker commands

- See runing containers (ie to get container id's)
  `docker ps`

### Development (`compose.yml`)

- Build container
  `docker-compose build`

- Start container (detached mode)
  `docker-compose up -d`

- Stop container
  `docker-compose down`

- Open shell (interactive terminal)
  `docker-compose -it web /bin/sh`
  (Ctrl + D to exit)

### Production equivalents (`compose.prod.yml`)

- `docker-compose -f compose.prod.yml build`
- `docker-compose -f compose.prod.yml up -d`
- `docker-compose -f compose.prod.yml down`
- `docker-compose -f compose.prod.yml exec -it web /bin/sh`

# URL Patterns

Public URLs
/ (Marketing)
/login
/signup
/logout
/links/:userid (Public preview)

Private URLs
/links/:userid/edit (React)
