package e_utils

import (
	"context"
	"log"
	"runtime/debug"
)

// Panics if err is not nil.
func Must(err error) {
	if err != nil {
		panic(err)
	}
}

// Utility function that recovers from a panic and logs the error and stack trace.
func Protect(f func()) {
	defer func() {
		if err := recover(); err != nil {
			log.Printf("recovered: %v", err)
			log.Printf("stacktrace: %s", string(debug.Stack()))
		}
	}()
	f()
}

// Utility function that recovers from a panic and calls a given callback function with the error.
func ProtectWithCallback(f func(), onError func(err interface{})) {
	defer func() {
		if err := recover(); err != nil {
			onError(err)
		}
	}()
	f()
}

// Extracts and returns the context from an optional slice of contexts. If the slice is empty, it returns a new context.
func DefaultCTX(slice []context.Context) context.Context {
	if len(slice) == 0 {
		return context.TODO()
	}
	return slice[0]
}
