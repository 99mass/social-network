.PHONY: run update_package install build dev start

run:
	cd backend && go run server.go

update_package:
	cd backend && go mod tidy


dev:
	cd frontend && npm install && npm run dev

# build:
# 	cd frontend && npm run build

# start:
# cd frontend && npm start