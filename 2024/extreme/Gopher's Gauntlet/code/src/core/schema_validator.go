package elemental

import (
	"elemental/utils"
	"fmt"
	"reflect"

	"regexp"
	"time"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func enforceSchema[T any](schema Schema, doc *T, reflectedEntityType *reflect.Type, defaults ...bool) (bson.M, bson.M) {
	var entityToInsert bson.M
	if reflectedEntityType != nil {
		entityToInsert = e_utils.Cast[bson.M](doc)
		if entityToInsert == nil {
			entityToInsert = make(bson.M)
		}
	} else {
		entityToInsert = *e_utils.ToBSONDoc(doc)
		reflectedEntityType = lo.ToPtr(reflect.TypeOf(doc).Elem())
	}
	if len(defaults) == 0 || defaults[0] {
		id, _ := (*reflectedEntityType).FieldByName("ID")
		createdAt, _ := (*reflectedEntityType).FieldByName("CreatedAt")
		updatedAt, _ := (*reflectedEntityType).FieldByName("UpdatedAt")
		if id.Type != nil {
			SetDefault(&entityToInsert, id.Tag.Get("bson"), primitive.NewObjectID())
		}
		if createdAt.Type != nil {
			SetDefault(&entityToInsert, createdAt.Tag.Get("bson"), time.Now())
		}
		if updatedAt.Type != nil {
			SetDefault(&entityToInsert, updatedAt.Tag.Get("bson"), time.Now())
		}
	}
	detailedEntity := lo.Assign(entityToInsert)
	for field, definition := range schema.Definitions {
		reflectedField, _ := (*reflectedEntityType).FieldByName(field)
		fieldBsonName := reflectedField.Tag.Get("bson")
		if e_utils.IsEmpty(entityToInsert[fieldBsonName]) {
			if definition.Required {
				panic(fmt.Sprintf("Field %s is required", field))
			}
			if definition.Default != nil {
				entityToInsert[fieldBsonName] = definition.Default
				detailedEntity[fieldBsonName] = definition.Default
			}
		}
		if definition.Type != reflect.Invalid && reflectedField.Type.Kind() != definition.Type {
			panic(fmt.Sprintf("Field %s has an invalid type. It must be of type %s", field, definition.Type.String()))
		}
		if definition.Type == reflect.Struct && definition.Schema != nil {
			subdocumentField, _ := (*reflectedEntityType).FieldByName(field)
			entityToInsert[fieldBsonName], detailedEntity[fieldBsonName] = enforceSchema(*definition.Schema, e_utils.Cast[*bson.M](entityToInsert[fieldBsonName]), &subdocumentField.Type, false)
			continue
		}
		if definition.Type == reflect.Struct && (definition.Ref != "" || definition.Collection != "") && entityToInsert[fieldBsonName] != nil {
			subdocumentField, _ := (*reflectedEntityType).FieldByName(field)
			subdocumentIdField, _ := subdocumentField.Type.FieldByName("ID")
			entityToInsert = lo.Assign(
				entityToInsert,
				bson.M{
					fieldBsonName: entityToInsert[fieldBsonName].(primitive.M)[subdocumentIdField.Tag.Get("bson")],
				},
			)
			continue
		}
		if definition.Min != 0 && e_utils.Cast[float64](entityToInsert[fieldBsonName]) < definition.Min {
			panic(fmt.Sprintf("Field %s must be greater than %f", field, definition.Min))
		}
		if definition.Max != 0 && e_utils.Cast[float64](entityToInsert[fieldBsonName]) > definition.Max {
			panic(fmt.Sprintf("Field %s must be less than %f", field, definition.Max))
		}
		if definition.Length != 0 && int64(len(e_utils.Cast[string](entityToInsert[fieldBsonName]))) > definition.Length {
			panic(fmt.Sprintf("Field %s must be less than %d characters", field, definition.Length))
		}
		if definition.Regex != "" && lo.Must(regexp.Match(definition.Regex, e_utils.ToJSON(entityToInsert[fieldBsonName]))) {
			panic(fmt.Sprintf("Field %s must match the regex pattern %s", field, definition.Regex))
		}
	}
	return entityToInsert, detailedEntity
}

func SetDefault[T any](entity *bson.M, field string, defaultValue T) {
	if entity != nil {
		if e_utils.IsEmpty((*entity)[field]) {
			(*entity)[field] = defaultValue
		}
	}
}
