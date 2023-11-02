FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY docker-compose.yml ./
# Bundle app source
COPY . .

RUN npm install
RUN npm install -g knex
RUN npm run migrate
RUN npm run seed
# If you are building your code for production
# RUN npm ci --omit=dev

# EXPOSE 8000
CMD [ "npm", "start" ]
