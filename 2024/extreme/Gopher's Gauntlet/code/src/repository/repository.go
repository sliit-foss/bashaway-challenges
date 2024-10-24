package e_repository

import (
	"context"
	"elemental/connection"
	"errors"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository[T any] struct {
	collection string
}

func NewRepository[T any](collection string) Repository[T] {
	return Repository[T]{collection: collection}
}

func (r Repository[T]) Create(payload T) primitive.ObjectID {
	result, err := e_connection.UseDefault().Collection(r.collection).InsertOne(context.TODO(), payload)
	if err != nil {
		panic(err)
	}
	return result.InsertedID.(primitive.ObjectID)
}

func (r Repository[T]) FindOne(query primitive.M) *T {
	model := new(T)
	doc := e_connection.UseDefault().Collection(r.collection).FindOne(context.Background(), query)
	if doc.Err() != nil {
		if errors.Is(doc.Err(), mongo.ErrNoDocuments) {
			log.Fatal(fmt.Sprintf("%v %s", r, doc.Err().Error()))
			return nil
		}
		panic(doc.Err())
	}
	doc.Decode(&model)
	return model
}

func (r Repository[T]) FindByID(id primitive.ObjectID) *T {
	return r.FindOne(primitive.M{"_id": id})
}

func (r Repository[T]) FindAll() []T {
	var users []T
	cursor, err := e_connection.UseDefault().Collection(r.collection).Find(context.Background(), primitive.M{})
	if err != nil {
		panic(err)
	}
	cursor.All(context.Background(), &users)
	return users
}

func (r Repository[T]) Update(id primitive.ObjectID, payload T) {
	_, err := e_connection.UseDefault().Collection(r.collection).UpdateOne(context.Background(), primitive.M{"_id": id}, primitive.M{"$set": payload})
	if err != nil {
		panic(err)
	}
}

func (r Repository[T]) Delete(id primitive.ObjectID) {
	_, err := e_connection.UseDefault().Collection(r.collection).DeleteOne(context.Background(), primitive.M{"_id": id})
	if err != nil {
		panic(err)
	}
}
