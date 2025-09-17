wsgi_app = "core.wsgi:application"
bind = "0.0.0.0:8000"
workers = 3
threads = 4
timeout = 30
graceful_timeout = 30
keepalive = 5
accesslog = "-"
errorlog = "-"
# debug info warning error critical (inc verbosity)
loglevel = "info"
chdir = "/home/app/web"
