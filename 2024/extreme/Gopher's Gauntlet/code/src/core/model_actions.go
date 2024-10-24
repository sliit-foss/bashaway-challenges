package elemental

import (
	"context"
	"elemental/connection"
	"elemental/utils"
	"reflect"

	"go.mongodb.org/mongo-driver/mongo"
)

func (m Model[T]) CreateCollection(ctx ...context.Context) *mongo.Collection {
	e_connection.Use(m.Schema.Options.Database, m.Schema.Options.Connection).CreateCollection(e_utils.DefaultCTX(ctx), m.Schema.Options.Collection, &m.Schema.Options.CollectionOptions)
	return m.Collection()
}

func (m Model[T]) Drop(ctx ...context.Context) {
	e_utils.Must(m.Collection().Drop(e_utils.DefaultCTX(ctx)))
}

// Sends out a ping to the underlying client connection used by this model.
func (m Model[T]) Ping(ctx ...context.Context) error {
	return m.Database().Client().Ping(e_utils.DefaultCTX(ctx), nil)
}

func (m Model[T]) SyncIndexes(ctx ...context.Context) {
	var sample [0]T
	m.Schema.syncIndexes(reflect.TypeOf(sample).Elem())
}

func (m Model[T]) DropIndexes(ctx ...context.Context) {
	m.Collection().Indexes().DropAll(e_utils.DefaultCTX(ctx))
}

func (m Model[T]) Validate(doc T) {
	enforceSchema(m.Schema, &doc, nil, false)
}

// Sets a temporary connection for this model. This connection will be used for the next operation only.
func (m Model[T]) SetConnection(connection string) Model[T] {
	m.temporaryConnection = &connection
	return m
}

// Sets a temporary database for this model. This database will be used for the next operation only.
func (m Model[T]) SetDatabase(database string) Model[T] {
	m.temporaryDatabase = &database
	return m
}

// Sets a temporary collection for this model. This collection will be used for the next operation only.
func (m Model[T]) SetCollection(collection string) Model[T] {
	m.temporaryCollection = &collection
	return m
}
