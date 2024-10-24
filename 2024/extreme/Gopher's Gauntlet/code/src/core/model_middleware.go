package elemental

import (
	e_utils "elemental/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type middlewareFunc func(...interface{}) bool

type listener[T any] struct {
	functions []middlewareFunc
}

type pre[T any] struct {
	save             listener[T]
	updateOne        listener[T]
	deleteOne        listener[T]
	deleteMany       listener[T]
	findOneAndUpdate listener[T]
	findOneAndDelete listener[T]
}

type post[T any] struct {
	save              listener[T]
	updateOne         listener[T]
	deleteOne         listener[T]
	deleteMany        listener[T]
	find              listener[T]
	findOneAndUpdate  listener[T]
	findOneAndDelete  listener[T]
	findOneAndReplace listener[T]
}

type middleware[T any] struct {
	pre  pre[T]
	post post[T]
}

func newMiddleware[T any]() middleware[T] {
	return middleware[T]{}
}

func (l listener[T]) run(args ...interface{}) {
	for _, middleware := range l.functions {
		next := middleware(args...)
		if !next {
			break
		}
	}
}

func (m Model[T]) PreSave(f func(doc T) bool) {
	m.middleware.pre.save.functions = append(m.middleware.pre.save.functions, func(args ...interface{}) bool {
		return f(args[0].(T))
	})
}

func (m Model[T]) PostSave(f func(doc T) bool) {
	m.middleware.post.save.functions = append(m.middleware.post.save.functions, func(args ...interface{}) bool {
		return f(args[0].(T))
	})
}

func (m Model[T]) PreUpdateOne(f func(doc any) bool) {
	m.middleware.pre.updateOne.functions = append(m.middleware.pre.updateOne.functions, func(args ...interface{}) bool {
		return f(args[0])
	})
}

func (m Model[T]) PostUpdateOne(f func(result *mongo.UpdateResult, err error) bool) {
	m.middleware.post.updateOne.functions = append(m.middleware.post.updateOne.functions, func(args ...interface{}) bool {
		return f(args[0].(*mongo.UpdateResult), e_utils.Cast[error](args[1]))
	})
}

func (m Model[T]) PreDeleteOne(f func(filters primitive.M) bool) {
	m.middleware.pre.deleteOne.functions = append(m.middleware.pre.deleteOne.functions, func(args ...interface{}) bool {
		return f(args[0].(primitive.M))
	})
}

func (m Model[T]) PostDeleteOne(f func(result *mongo.DeleteResult, err error) bool) {
	m.middleware.post.deleteOne.functions = append(m.middleware.post.deleteOne.functions, func(args ...interface{}) bool {
		return f(args[0].(*mongo.DeleteResult), e_utils.Cast[error](args[1]))
	})
}

func (m Model[T]) PreDeleteMany(f func(filters primitive.M) bool) {
	m.middleware.pre.deleteMany.functions = append(m.middleware.pre.deleteMany.functions, func(args ...interface{}) bool {
		return f(args[0].(primitive.M))
	})
}

func (m Model[T]) PostDeleteMany(f func(result *mongo.DeleteResult, err error) bool) {
	m.middleware.post.deleteMany.functions = append(m.middleware.post.deleteMany.functions, func(args ...interface{}) bool {
		return f(args[0].(*mongo.DeleteResult), e_utils.Cast[error](args[1]))
	})
}

func (m Model[T]) PostFind(f func(doc []T) bool) {
	m.middleware.post.find.functions = append(m.middleware.post.find.functions, func(args ...interface{}) bool {
		return f(args[0].([]T))
	})
}

func (m Model[T]) PostFindOneAndUpdate(f func(doc *T) bool) {
	m.middleware.post.findOneAndUpdate.functions = append(m.middleware.post.findOneAndUpdate.functions, func(args ...interface{}) bool {
		return f(args[0].(*T))
	})
}

func (m Model[T]) PreFindOneAndUpdate(f func(filters primitive.M) bool) {
	m.middleware.pre.findOneAndUpdate.functions = append(m.middleware.pre.findOneAndUpdate.functions, func(args ...interface{}) bool {
		return f(args[0].(primitive.M))
	})
}

func (m Model[T]) PreFindOneAndDelete(f func(filters primitive.M) bool) {
	m.middleware.pre.findOneAndDelete.functions = append(m.middleware.pre.findOneAndDelete.functions, func(args ...interface{}) bool {
		return f(args[0].(primitive.M))
	})
}

func (m Model[T]) PostFindOneAndDelete(f func(doc *T) bool) {
	m.middleware.post.findOneAndDelete.functions = append(m.middleware.post.findOneAndDelete.functions, func(args ...interface{}) bool {
		return f(args[0].(*T))
	})
}

func (m Model[T]) PostFindOneAndReplace(f func(doc *T) bool) {
	m.middleware.post.findOneAndReplace.functions = append(m.middleware.post.findOneAndReplace.functions, func(args ...interface{}) bool {
		return f(args[0].(*T))
	})
}
