FROM --platform=linux/amd64 node:22-alpine 

WORKDIR /app

RUN apk update && apk add --no-cache gcc g++ make python3 openjdk17

COPY . .

RUN npm install -g pm2
RUN npm install

EXPOSE 3000

CMD ["pm2-runtime", "startAll.js"]