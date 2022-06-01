# Stage 1: Build
FROM node AS build
ENV NODE_ENV=production
WORKDIR /usr/src/pricechecker
COPY package*.json ./
RUN npm ci --only:Production
COPY . .
CMD [ "npm", "run", "build:prod" ]

# Stage 2: Run
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/pricechecker/dist/pricechecker /usr/share/nginx/html
