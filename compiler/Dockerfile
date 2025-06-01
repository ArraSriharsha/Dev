FROM node:22-alpine 

WORKDIR /app

RUN apk update && apk add --no-cache gcc g++ make python3 openjdk17

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]