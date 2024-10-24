package elemental

import (
	"context"
	"elemental/connection"
	"elemental/utils"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Returns the underlying collection instance this model uses.
func (m Model[T]) Collection() *mongo.Collection {
	connection := lo.FromPtr(e_utils.Coalesce(m.temporaryConnection, &m.Schema.Options.Connection))
	database := lo.FromPtr(e_utils.Coalesce(m.temporaryDatabase, &m.Schema.Options.Database))
	collection := lo.FromPtr(e_utils.Coalesce(m.temporaryCollection, &m.Schema.Options.Collection))
	return e_connection.Use(database, connection).Collection(collection)
}

// Returns the underlying database instance this model uses
func (m Model[T]) Database() *mongo.Database {
	return m.Collection().Database()
}

// Returns the count of all documents in a collection or view
func (m Model[T]) EstimatedDocumentCount(ctx ...context.Context) int64 {
	count, _ := m.Collection().EstimatedDocumentCount(e_utils.DefaultCTX(ctx))
	return count
}

// Returns statistics about the model collection
func (m Model[T]) Stats(ctx ...context.Context) CollectionStats {
	result := m.Database().RunCommand(e_utils.DefaultCTX(ctx), bson.M{"collStats": m.Schema.Options.Collection})
	var stats CollectionStats
	e_utils.Must(result.Decode(&stats))
	return stats
}

// The total amount of storage in bytes allocated to this collection for document storage
func (m Model[T]) StorageSize(ctx ...context.Context) int64 {
	return m.Stats(e_utils.DefaultCTX(ctx)).StorageSize
}

// The total size in bytes of the data in the collection plus the size of every index on the collection
func (m Model[T]) TotalSize(ctx ...context.Context) int64 {
	return m.Stats(e_utils.DefaultCTX(ctx)).Size
}

// The total size of all indexes for the collection
func (m Model[T]) TotalIndexSize(ctx ...context.Context) int64 {
	return m.Stats(e_utils.DefaultCTX(ctx)).TotalIndexSize
}

// The average size of each document in the collection
func (m Model[T]) AvgObjSize(ctx ...context.Context) int64 {
	return m.Stats(e_utils.DefaultCTX(ctx)).AvgObjSize
}

// Returns true if the model collection is a capped collection, otherwise returns false
func (m Model[T]) IsCapped(ctx ...context.Context) bool {
	return m.Stats(e_utils.DefaultCTX(ctx)).Capped
}

// Returns the number of indexes in the model collection
func (m Model[T]) NumberOfIndexes(ctx ...context.Context) int64 {
	return m.Stats(e_utils.DefaultCTX(ctx)).NumberOfIndexes
}
