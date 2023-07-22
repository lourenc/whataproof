FROM golang:1.19.3-alpine3.16 AS builder

# Install gcc and auxilliary tools, required for go-sqlite3 and go-ethereum
RUN apk add build-base

# Set the Current Working Directory inside the container
WORKDIR /app

# We want to populate the module cache based on the go.{mod,sum} files.
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

# Build the Go app
RUN go build -o out .


FROM alpine:3.16

WORKDIR /app

# Prepare DB files folder
RUN mkdir data

# Copy the built app from builder
COPY --from=builder /app/out ./

# Expose port 8080 to the outside world
EXPOSE 8080

# Run the binary program produced by `go install`
ENV GIN_MODE=release
CMD ./out
