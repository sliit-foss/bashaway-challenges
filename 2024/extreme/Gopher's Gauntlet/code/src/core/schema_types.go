package elemental

import (
	"go.mongodb.org/mongo-driver/mongo/options"
	"reflect"
)

type SchemaOptions struct {
	Collection        string
	CollectionOptions options.CreateCollectionOptions
	Database          string
	Connection        string
}

type Field struct {
	Type       reflect.Kind
	Schema     *Schema
	Required   bool
	Default    any
	Min        float64
	Max        float64
	Length     int64
	Regex      string
	Index      options.IndexOptions
	IndexOrder int
	Ref        string
	Collection string
}
