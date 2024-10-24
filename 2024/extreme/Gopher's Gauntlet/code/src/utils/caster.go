package e_utils

import (
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
)

// Converts any type to a given type. If conversion fails, it returns the zero value of the given type.
func Cast[T any](val any) T {
	if val, ok := val.(T); ok {
		return val
	}
	var zero T
	return zero
}

// Converts any type to a given type based on their json representation. It partially fills the target in case they are not directly compatible.
func CastJSON[T any](val any) T {
	return FromJSON[T](ToJSON(val))
}

// Converts a given value to a byte array.
func ToJSON(val any) []byte {
	bytes, _ := json.Marshal(val)
	return bytes
}

// Converts a byte array to a given type.
func FromJSON[T any](bytes []byte) T {
	var v T
	json.Unmarshal(bytes, &v)
	return v
}

// Converts any type to a map[string]interface{}.
func ToMap(s any) map[string]interface{} {
	m := make(map[string]interface{})
	json.Unmarshal(ToJSON(s), &m)
	return m
}

// Converts any type to a given type based on their bson representation. It partially fills the target in case they are not directly compatible.
func CastBSON[T any](val any) T {
	return FromBSON[T](ToBSON(val))
}

// Converts a given value to a byte array.
func ToBSON(val any) []byte {
	bytes, _ := bson.Marshal(val)
	return bytes
}

// Converts a byte array to a given type.
func FromBSON[T any](bytes []byte) T {
	var v T
	bson.Unmarshal(bytes, &v)
	return v
}

// Converts an interface to a bson document
func ToBSONDoc(v interface{}) (doc *bson.M) {
	data, err := bson.Marshal(v)
	if err != nil {
		return nil
	}
	bson.Unmarshal(data, &doc)
	return doc
}
