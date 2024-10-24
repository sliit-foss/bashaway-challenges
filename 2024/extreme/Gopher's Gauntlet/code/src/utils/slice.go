package e_utils

import (
	"github.com/samber/lo"
)

func ElementAtIndex[T any](slice []T, index int) T {
	if index < 0 || index >= len(slice) {
		var zero T
		return zero
	}
	return slice[index]
}

func FirstPtr[T any](slice []T) *T {
	if len(slice) == 0 {
		return nil
	}
	return &slice[0]
}

func First[T any](slice []T) T {
	return ElementAtIndex(slice, 0)
}

func CastSlice[T any](slice []any) []T {
	return lo.Map(slice, func(doc any, _ int) T {
		return Cast[T](doc)
	})
}

func CastBSONSlice[T any](slice []interface{}) []T {
	return lo.Map(slice, func(doc interface{}, _ int) T {
		return CastBSON[T](doc)
	})
}
