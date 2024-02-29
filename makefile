.PHONY: run update_package install build dev start

run:
	cd backend && go run server.go

update_package:
	cd backend && go mod tidy

db:
	sqlite3 backend/pkg/db/database.db

dev:
	cd frontend && npm install && npm run dev

# Create both images(backend and frontend)
docker-images:
	docker build -t backend-image ./backend && docker build -t frontend-image ./frontend

# Run both containers
docker-run:
	docker run --name backend -d -p 8080:8080 backend-image && docker run --name frontend -d -p 3000:3000 frontend-image

# Stop running containers
docker-stop:
	docker stop backend && docker stop frontend

# Remove containers created
docker-remove-container:
	docker rm frontend && docker rm backend

# Remove images created
docker-remove-images : 
	docker rmi backend-image && docker rmi frontend-image


# build:
# 	cd frontend && npm run build

# start:
# cd frontend && npm start