build:
	 docker-compose up --build

start:
	 docker-compose up

stop:
	 docker-compose down

restart:
	 docker-compose down && docker-compose up --build

migrate:
	 docker-compose run backend python manage.py migrate

createsuperuser:
	 docker-compose run backend python manage.py createsuperuser

collectstatic:
	 docker-compose run backend python manage.py collectstatic --noinput

logs:
	 docker-compose logs -f

logs-backend:
	 docker-compose logs -f backend

logs-frontend:
	 docker-compose logs -f frontend

logs-db:
	 docker-compose logs -f db
