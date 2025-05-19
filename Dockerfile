FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml nest-cli.json ./

COPY apps ./apps

RUN pnpm install --frozen-lockfile

ARG SERVICE

RUN pnpm exec nest build $SERVICE

EXPOSE 3000

CMD ["node", "dist/apps/${SERVICE}/main.js"]
