FROM node:23.11.0

RUN mkdir -p /app
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN
ADD ./ /app

CMD ["yarn","production"]
