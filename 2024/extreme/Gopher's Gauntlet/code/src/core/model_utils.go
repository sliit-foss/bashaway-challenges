package elemental

import (
	"context"
	"elemental/utils"
	"reflect"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (m Model[T]) addToFilters(key string, value any) Model[T] {
	stage := "$match"
	foundMatchStage := false
	m.pipeline = lo.Map(m.pipeline, func(stg bson.D, _ int) bson.D {
		filters := e_utils.Cast[primitive.M](e_utils.CastBSON[bson.M](stg)[stage])
		if filters != nil {
			foundMatchStage = true
			if m.orConditionActive {
				if filters["$or"] == nil {
					filters["$or"] = []primitive.M{
						{m.whereField: primitive.M{key: value}},
					}
				} else {
					filters["$or"] = append(filters["$or"].([]primitive.M), primitive.M{m.whereField: primitive.M{key: value}})
				}
				for k, v := range filters {
					if k != "$or" {
						filters["$or"] = append(filters["$or"].([]primitive.M), primitive.M{k: v})
						delete(filters, k)
					}
				}
				m.orConditionActive = false
			} else {
				filterExistsWithinAndOperator := false
				if filters["$and"] != nil {
					for _, filter := range filters["$and"].([]primitive.M) {
						if filter[m.whereField] != nil {
							filterExistsWithinAndOperator = true
							filters["$and"] = append(filters["$and"].([]primitive.M), primitive.M{m.whereField: primitive.M{key: value}})
						}
					}
				}
				if !filterExistsWithinAndOperator {
					if filters[m.whereField] == nil {
						filters[m.whereField] = primitive.M{key: value}
					} else {
						filters["$and"] = []primitive.M{
							{m.whereField: filters[m.whereField]},
							{m.whereField: primitive.M{key: value}},
						}
						delete(filters, m.whereField)
					}
				}
			}
			return bson.D{{Key: stage, Value: filters}}
		}
		return stg
	})
	if !foundMatchStage {
		m.pipeline = append(m.pipeline, bson.D{{Key: stage, Value: primitive.M{m.whereField: primitive.M{key: value}}}})
		return m
	}
	return m
}

func (m Model[T]) addToPipeline(stage, key string, value any) Model[T] {
	foundStage := false
	m.pipeline = lo.Map(m.pipeline, func(stg bson.D, _ int) bson.D {
		stageObject := e_utils.Cast[bson.D](e_utils.CastBSON[bson.D](stg).Map()[stage])
		if stageObject != nil {
			foundStage = true
			if stageObject.Map()[key] == nil {
				stageObject = append(stageObject, bson.E{Key: key, Value: value})
			}
			return bson.D{{Key: stage, Value: stageObject}}
		}
		return stg
	})
	if !foundStage {
		m.pipeline = append(m.pipeline, bson.D{{Key: stage, Value: bson.D{{Key: key, Value: value}}}})
		return m
	}
	return m
}

func (m Model[T]) checkConditionsAndPanic(results []T) {
	if m.failWith != nil && len(results) == 0 {
		panic(*m.failWith)
	}
}

func (m Model[T]) checkConditionsAndPanicForSingleResult(result *mongo.SingleResult) {
	if result.Err() != nil {
		if m.failWith != nil {
			panic(*m.failWith)
		}
		panic(result.Err())
	}
}

func (m Model[T]) checkConditionsAndPanicForErr(err error) {
	if err != nil {
		if m.failWith != nil {
			panic(*m.failWith)
		}
		panic(err)
	}
}

func (m Model[T]) findMatchStage() bson.M {
	for i, stage := range m.pipeline {
		if stage[0].Key == "$match" {
			return m.pipeline[i][0].Value.(bson.M)
		}
	}
	return bson.M{}
}

func (m Model[T]) parseDocument(doc any) primitive.M {
	if reflect.TypeOf(doc).Kind() == reflect.Ptr {
		doc = reflect.ValueOf(doc).Elem().Interface()
	}
	if reflect.TypeOf(doc).Kind() == reflect.Map {
		return e_utils.Cast[primitive.M](doc)
	}
	result := e_utils.ToBSONDoc(doc)
	for k, v := range *result {
		if !reflect.ValueOf(v).IsValid() || reflect.ValueOf(v).IsZero() {
			delete(*result, k)
		}
	}
	return *result
}

func parseUpdateOptions[T any, O any](m Model[T], opts []*O) []*O {
	setOptions := func(option string, value any) {
		if len(opts) == 0 {
			var emptyOptionInstance *O
			options := reflect.New(reflect.TypeOf(emptyOptionInstance).Elem())
			options.MethodByName(option).Call([]reflect.Value{reflect.ValueOf(value)})
			opts = append(opts, options.Interface().(*O))
		} else {
			options := reflect.ValueOf(opts[0]).Elem()
			options.MethodByName(option).Call([]reflect.Value{reflect.ValueOf(value)})
			opts[0] = options.Interface().(*O)
		}
	}
	if m.upsert {
		setOptions("SetUpsert", true)
	}
	if m.returnNew {
		setOptions("SetReturnDocument", options.After)
	}
	return opts
}

func (m Model[T]) setUpdateOperator(operator string, doc any) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		return (func() any {
			result, err := m.Collection().UpdateMany(ctx, m.findMatchStage(), primitive.M{operator: m.parseDocument(doc)})
			m.checkConditionsAndPanicForErr(err)
			return result
		})()
	}
	return m
}
