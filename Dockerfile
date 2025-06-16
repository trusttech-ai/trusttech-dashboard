# build stage
FROM node:20 as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# runtime stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN yarn install --production

CMD ["node", "dist/index.js"]