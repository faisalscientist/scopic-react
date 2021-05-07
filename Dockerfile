FROM node:14.16.0

WORKDIR /app/frontend
COPY . .
RUN npm install

EXPOSE 3000

CMD npm run start