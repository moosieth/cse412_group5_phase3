FROM node:18-alpine

WORKDIR /react-app

# Remove node_modules just in case
RUN rm -rf node_modules

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
