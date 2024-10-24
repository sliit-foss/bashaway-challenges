package elemental

import (
	"elemental/utils"
	"reflect"
	"strings"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (m Model[T]) populate(value any) Model[T] {
	var path, selectField, fieldname *string
	if reflect.ValueOf(value).Kind() == reflect.Map {
		populate := value.(primitive.M)
		path = lo.ToPtr(e_utils.Cast[string](populate["path"]))
		selectField = lo.ToPtr(e_utils.Cast[string](populate["select"]))
	} else {
		path = lo.ToPtr(e_utils.Cast[string](value))
	}
	if path != nil {
		var sample [0]T
		modelType := reflect.TypeOf(sample).Elem()
		for i := 0; i < modelType.NumField(); i++ {
			field := modelType.Field(i)
			if field.Tag.Get("bson") == *path {
				fieldname = &field.Name
				break
			}
		}
		if fieldname != nil {
			schemaField := m.Schema.Field(*fieldname)
			if schemaField != nil {
				collection := schemaField.Collection
				if lo.IsEmpty(collection) {
					if !lo.IsEmpty(schemaField.Ref) {
						model := reflect.ValueOf(Models[schemaField.Ref])
						collection = model.FieldByName("Schema").FieldByName("Options").FieldByName("Collection").String()
					}
				}
				if !lo.IsEmpty(collection) {
					lookup := primitive.M{
						"from":         collection,
						"localField":   *path,
						"foreignField": "_id",
						"as":           *path,
					}
					if selectField != nil {
						lookup["pipeline"] = []primitive.M{
							{"$project": selectField},
						}
					}
					m.pipeline = append(m.pipeline, bson.D{{Key: "$lookup", Value: lookup}})
					if schemaField.Type != reflect.Slice {
						unwind := primitive.M{
							"path":                       "$" + *path,
							"preserveNullAndEmptyArrays": true,
						}
						m.pipeline = append(m.pipeline, bson.D{{Key: "$unwind", Value: unwind}})
					} else {
						m.pipeline = append(m.pipeline, bson.D{{Key: "$lookup", Value: lookup}})
					}
				}
			}
		}
	}
	return m
}

func (m Model[T]) Populate(values ...any) Model[T] {
	if len(values) == 1 && reflect.ValueOf(values[0]).Kind() == reflect.String && (strings.Contains(values[0].(string), ",") || strings.Contains(values[0].(string), " ")) {
		values := strings.FieldsFunc(values[0].(string), func(r rune) bool {
			return r == ',' || r == ' '
		})
		for _, value := range values {
			m = m.populate(value)
		}
	} else {
		for _, value := range values {
			m = m.populate(value)
		}
	}
	return m
}
