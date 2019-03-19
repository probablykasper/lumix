FROM golang:1.12-alpine
WORKDIR /go/src/app
RUN apk update \
	&& apk add --no-cache git
RUN go get github.com/cespare/reflex
RUN go get github.com/mholt/certmagic
COPY . .
CMD ["reflex", "--start-service", "-g", "*.go", "go", "run", "server.go"]

# build stage
# FROM golang:alpine AS build-env
# ADD . /src
# RUN cd /src && go build -o goapp

# final stage
# FROM alpine
# WORKDIR /app
# COPY --from=build-dev /src/goapp /app/
# ENTRYPOINT ./goapp
