PROD_BINARY_NAME=wordlestats
LOCAL_BINARY_NAME=wordlestats_local

test:
	go test -race -timeout 30s -v ./internal/...

build-prod:
	go build -o ${PROD_BINARY_NAME} ./cmd/wordlestats/main.go

build-local:
	go build -o ${LOCAL_BINARY_NAME} ./cmd/wordlestats/main.go

build-frontend:
	tsc ./frontend/app.ts --outfile ./public/scripts/app.js

clean:
	rm -f ${LOCAL_BINARY_NAME}
	rm -f ${PROD_BINARY_NAME}
	rm -f ./public/scripts/app.js

.PHONY: test build-prod build-local build-frontend clean