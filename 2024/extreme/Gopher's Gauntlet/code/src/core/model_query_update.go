package elemental

import (
	"context"
	"elemental/utils"
	"reflect"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (m Model[T]) FindOneAndUpdate(query *primitive.M, doc any, opts ...*options.FindOneAndUpdateOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		m.middleware.pre.findOneAndUpdate.run(doc)
		return (func() any {
			var resultDoc T
			filters := lo.FromPtr(query)
			for k, v := range m.findMatchStage() {
				filters[k] = v
			}
			result := m.Collection().FindOneAndUpdate(ctx, filters, primitive.M{"$set": m.parseDocument(doc)}, parseUpdateOptions(m, opts)...)
			m.middleware.post.findOneAndUpdate.run(&resultDoc)
			m.checkConditionsAndPanicForSingleResult(result)
			e_utils.Must(result.Decode(&resultDoc))
			return resultDoc
		})()
	}
	return m
}

func (m Model[T]) FindByIDAndUpdate(id primitive.ObjectID, doc any, opts ...*options.FindOneAndUpdateOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		var resultDoc T
		result := m.Collection().FindOneAndUpdate(ctx, primitive.M{"_id": id}, primitive.M{"$set": m.parseDocument(doc)}, parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForSingleResult(result)
		e_utils.Must(result.Decode(&resultDoc))
		return resultDoc
	}
	return m
}

func (m Model[T]) UpdateOne(query *primitive.M, doc any, opts ...*options.UpdateOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		filters := make(primitive.M)
		if query != nil {
			filters = lo.FromPtr(query)
		}
		for k, v := range m.findMatchStage() {
			filters[k] = v
		}
		if m.upsert {
			if len(opts) == 0 {
				opts = append(opts, &options.UpdateOptions{Upsert: lo.ToPtr(true)})
			} else {
				opts[0].SetUpsert(true)
			}
		}
		m.middleware.pre.updateOne.run(doc)
		result, err := m.Collection().UpdateOne(ctx, filters, primitive.M{"$set": m.parseDocument(doc)}, opts...)
		m.middleware.post.updateOne.run(result, err)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) UpdateByID(id primitive.ObjectID, doc any, opts ...*options.UpdateOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		result, err := m.Collection().UpdateOne(ctx, primitive.M{"_id": id}, primitive.M{"$set": m.parseDocument(doc)}, parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) Save(doc T) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		m.middleware.pre.save.run(doc)
		m.UpdateByID(reflect.ValueOf(doc).FieldByName("ID").Interface().(primitive.ObjectID), doc).Exec()
		m.middleware.post.save.run(doc)
		return doc
	}
	return m
}

func (m Model[T]) UpdateMany(query *primitive.M, doc any, opts ...*options.UpdateOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		filters := make(primitive.M)
		if query != nil {
			filters = lo.FromPtr(query)
		}
		for k, v := range m.findMatchStage() {
			filters[k] = v
		}
		result, err := m.Collection().UpdateMany(ctx, filters, primitive.M{"$set": m.parseDocument(doc)}, parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) ReplaceOne(query *primitive.M, doc any, opts ...*options.ReplaceOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		filters := make(primitive.M)
		if query != nil {
			filters = lo.FromPtr(query)
		}
		for k, v := range m.findMatchStage() {
			filters[k] = v
		}
		result, err := m.Collection().ReplaceOne(ctx, filters, m.parseDocument(doc), parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) ReplaceByID(id primitive.ObjectID, doc any, opts ...*options.ReplaceOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		result, err := m.Collection().ReplaceOne(ctx, primitive.M{"_id": id}, m.parseDocument(doc), parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) FindOneAndReplace(query *primitive.M, doc any, opts ...*options.FindOneAndReplaceOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		var resultDoc T
		filters := make(primitive.M)
		if query != nil {
			filters = lo.FromPtr(query)
		}
		for k, v := range m.findMatchStage() {
			filters[k] = v
		}
		res := m.Collection().FindOneAndReplace(ctx, filters, m.parseDocument(doc), opts...)
		m.middleware.post.findOneAndReplace.run(&resultDoc)
		m.checkConditionsAndPanicForSingleResult(res)
		e_utils.Must(res.Decode(&resultDoc))
		return resultDoc
	}
	return m
}

func (m Model[T]) FindByIDAndReplace(id primitive.ObjectID, doc any, opts ...*options.FindOneAndReplaceOptions) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		var resultDoc T
		res := m.Collection().FindOneAndReplace(ctx, primitive.M{"_id": id}, m.parseDocument(doc), parseUpdateOptions(m, opts)...)
		m.checkConditionsAndPanicForSingleResult(res)
		e_utils.Must(res.Decode(&resultDoc))
		return resultDoc
	}
	return m
}

func (m Model[T]) Set(doc any) Model[T] {
	return m.setUpdateOperator("$set", doc)
}

func (m Model[T]) Unset(doc any) Model[T] {
	if reflect.TypeOf(doc).Kind() == reflect.String {
		doc = primitive.M{doc.(string): ""}
	}
	return m.setUpdateOperator("$unset", doc)
}

func (m Model[T]) Inc(field string, value int) Model[T] {
	return m.setUpdateOperator("$inc", primitive.M{field: value})
}

func (m Model[T]) Dec(field string, value int) Model[T] {
	return m.setUpdateOperator("$inc", primitive.M{field: -value})
}

func (m Model[T]) Mul(field string, value int) Model[T] {
	return m.setUpdateOperator("$mul", primitive.M{field: value})
}

func (m Model[T]) Div(field string, value int) Model[T] {
	return m.setUpdateOperator("$mul", primitive.M{field: (float64(1) / float64(value))})
}

func (m Model[T]) Rename(field string, newField string) Model[T] {
	return m.setUpdateOperator("$rename", primitive.M{field: newField})
}

func (m Model[T]) Min(field string, value int) Model[T] {
	return m.setUpdateOperator("$min", primitive.M{field: value})
}

func (m Model[T]) Max(field string, value int) Model[T] {
	return m.setUpdateOperator("$max", primitive.M{field: value})
}

func (m Model[T]) CurrentDate(doc any) Model[T] {
	return m.setUpdateOperator("$currentDate", doc)
}

func (m Model[T]) AddToSet(field string, values ...any) Model[T] {
	if len(values) == 1 {
		return m.setUpdateOperator("$addToSet", primitive.M{field: values[0]})
	}
	return m.setUpdateOperator("$addToSet", primitive.M{field: primitive.M{"$each": values}})
}

func (m Model[T]) Pop(field string, value ...int) Model[T] {
	if len(value) == 0 {
		return m.setUpdateOperator("$pop", primitive.M{field: 1})
	}
	return m.setUpdateOperator("$pop", primitive.M{field: value[0]})
}

func (m Model[T]) Shift(field string) Model[T] {
	return m.setUpdateOperator("$pop", primitive.M{field: -1})
}

func (m Model[T]) Pull(field string, value any) Model[T] {
	return m.setUpdateOperator("$pull", primitive.M{field: value})
}

func (m Model[T]) PullAll(field string, values ...any) Model[T] {
	return m.setUpdateOperator("$pullAll", primitive.M{field: values})
}

func (m Model[T]) Push(field string, values ...any) Model[T] {
	if len(values) == 1 {
		return m.setUpdateOperator("$push", primitive.M{field: values[0]})
	}
	return m.setUpdateOperator("$push", primitive.M{field: primitive.M{"$each": values}})
}

// Insert a new document if no documents match the query
func (m Model[T]) Upsert() Model[T] {
	m.upsert = true
	return m
}

// Return the new document instead of the original document after an update
func (m Model[T]) New() Model[T] {
	m.returnNew = true
	return m
}
