package elemental

import (
	"context"
	"elemental/utils"
	"reflect"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (m Model[T]) FindOneAndDelete(query ...primitive.M) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		var doc T
		m.middleware.pre.findOneAndDelete.run(e_utils.First(query))
		result := m.Collection().FindOneAndDelete(ctx, e_utils.DefaultQuery(query...))
		m.middleware.post.findOneAndDelete.run(&doc)
		m.checkConditionsAndPanicForSingleResult(result)
		e_utils.Must(result.Decode(&doc))
		return doc
	}
	return m
}

func (m Model[T]) FindByIdAndDelete(id primitive.ObjectID) Model[T] {
	return m.FindOneAndDelete(primitive.M{"_id": id})
}

func (m Model[T]) DeleteOne(query ...primitive.M) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		m.middleware.pre.deleteOne.run(e_utils.First(query))
		result, err := m.Collection().DeleteOne(ctx, e_utils.DefaultQuery(query...))
		m.middleware.post.deleteOne.run(result, err)
		m.checkConditionsAndPanicForErr(err)
		return result
	}
	return m
}

func (m Model[T]) DeleteByID(id primitive.ObjectID) Model[T] {
	return m.DeleteOne(primitive.M{"_id": id})
}

func (m Model[T]) Delete(doc T) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		m.DeleteByID(reflect.ValueOf(doc).FieldByName("ID").Interface().(primitive.ObjectID)).Exec()
		return nil
	}
	return m
}

func (m Model[T]) DeleteMany(query ...primitive.M) Model[T] {
	m.executor = func(m Model[T], ctx context.Context) any {
		m.middleware.pre.deleteMany.run(e_utils.First(query))
		result, err := m.Collection().DeleteMany(ctx, e_utils.DefaultQuery(query...))
		m.checkConditionsAndPanicForErr(err)
		m.middleware.post.deleteMany.run(result, err)
		return result
	}
	return m
}
