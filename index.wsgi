import sae
from shanwaa import wsgi

application = sae.create_wsgi_app(wsgi.application)
