# Use an official Go runtime as a parent image
FROM golang:latest

# Set the working directory in the container
WORKDIR /app

# Copy the local package files to the container's workspace
COPY . .

# Build the Go app
# RUN go build -o main .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the executable
CMD ["go","run","server.go"]
