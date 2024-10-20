LOCAL_BINARY_NAME=wordlestats_local

test:
	go test -race -timeout 30s -v ./internal/...

build-local:
	go build -o ${LOCAL_BINARY_NAME} ./cmd/wordlestats/main.go

clean:
	rm -f ${LOCAL_BINARY_NAME}

.PHONY: test build-local clean