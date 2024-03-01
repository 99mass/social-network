# Use an official Node runtime as a parent image
FROM node:latest

LABEL AUTHORS="Mouhamed Alioune Diouf, Alassane Diop, Oumar Samb,Samba Diop,Elhadji Malick Lo, Alain Gildas Ogou"
LABEL DESCRIPTION="This is the Client-Side(frontend) of the Social network project it use NextJS"
LABEL VERSION="latest"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the local package files to the container's workspace
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
