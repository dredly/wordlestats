LOCAL_BINARY_NAME=wordlestats_local

test:
	go test -race -timeout 30s -v ./internal/...

build-local:
	go build -o ${LOCAL_BINARY_NAME} ./cmd/wordlestats/main.go

build-frontend:
	tsc ./frontend/app.ts --outfile ./public/scripts/app.js

clean:
	rm -f ${LOCAL_BINARY_NAME}
	rm -f ./public/scripts/app.js

.PHONY: test build-local build-frontend clean