# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY server/ ./server/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /rapidlynk-server ./server

# Production minimal image
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /rapidlynk-server /app/rapidlynk-server

EXPOSE 8080

ENV PORT=8080

CMD ["/app/rapidlynk-server"]
