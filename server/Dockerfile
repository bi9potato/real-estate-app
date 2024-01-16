FROM node:20.10.0

# We use nodemon to restart the server every time there's a change
RUN npm install -g nodemon

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

# Use script specified in package,json
CMD ["npm", "run", "dev"]