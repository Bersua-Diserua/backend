FROM node:alpine3.16 as base

RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta

WORKDIR /app


FROM base as builder

COPY . .

RUN yarn install

RUN yarn build

RUN npm prune --omit=dev -f

FROM base

COPY --from=builder /app/ /app/

EXPOSE 3000:3000

CMD ["node", "dist"]
