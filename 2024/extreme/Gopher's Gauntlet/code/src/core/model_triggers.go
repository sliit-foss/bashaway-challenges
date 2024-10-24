package elemental

import (
	"context"
	"elemental/utils"
	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type triggerType string

const (
	triggerTypeInsert           triggerType = "insert"
	triggerTypeUpdate           triggerType = "update"
	triggerTypeDelete           triggerType = "delete"
	triggerTypeReplace          triggerType = "replace"
	triggerTypeCollectionDrop   triggerType = "drop"
	triggerTypeCollectionRename triggerType = "rename"
	triggerTypeStreamInvalidate triggerType = "invalidate"
)

type TriggerOptions struct {
	Filter  *primitive.M
	Context *context.Context
}

func (m Model[T]) on(event triggerType, f func(change primitive.M), opts ...TriggerOptions) {
	go lo.Try(func() error {
		filters := primitive.M{}
		ctx := context.Background()
		if len(opts) > 0 {
			if opts[0].Context != nil {
				ctx = *opts[0].Context
			}
			if opts[0].Filter != nil {
				filters = *opts[0].Filter
			}
		}
		filters["operationType"] = event
		cs := lo.Must(m.Collection().Watch(ctx, mongo.Pipeline{
			bson.D{{Key: "$match", Value: filters}},
		}, options.ChangeStream().SetFullDocument(options.UpdateLookup)))
		defer cs.Close(ctx)
		for cs.Next(ctx) {
			var changeDoc bson.M
			if err := cs.Decode(&changeDoc); err != nil {
				return err
			}
			f(changeDoc)
		}
		return nil
	})
}

func (m Model[T]) OnInsert(f func(doc T), opts ...TriggerOptions) {
	m.on(triggerTypeInsert, func(change primitive.M) {
		f(e_utils.CastBSON[T](change["fullDocument"]))
	}, opts...)
}

func (m Model[T]) OnUpdate(f func(doc T), opts ...TriggerOptions) {
	m.on(triggerTypeUpdate, func(change primitive.M) {
		f(e_utils.CastBSON[T](change["fullDocument"]))
	}, opts...)
}

func (m Model[T]) OnDelete(f func(id primitive.ObjectID), opts ...TriggerOptions) {
	m.on(triggerTypeDelete, func(change primitive.M) {
		f(e_utils.Cast[primitive.ObjectID](change["documentKey"].(primitive.M)["_id"]))
	}, opts...)
}

func (m Model[T]) OnReplace(f func(doc T), opts ...TriggerOptions) {
	m.on(triggerTypeReplace, func(change primitive.M) {
		f(e_utils.CastBSON[T](change["fullDocument"]))
	}, opts...)
}

func (m Model[T]) OnCollectionDrop(f func(), opts ...TriggerOptions) {
	m.on(triggerTypeCollectionDrop, func(change primitive.M) {
		f()
	}, opts...)
}

func (m Model[T]) OnCollectionRename(f func(), opts ...TriggerOptions) {
	m.on(triggerTypeCollectionRename, func(change primitive.M) {
		f()
	}, opts...)
}

func (m Model[T]) OnStreamInvalidate(f func(), opts ...TriggerOptions) {
	m.on(triggerTypeStreamInvalidate, func(change primitive.M) {
		f()
	}, opts...)
}
