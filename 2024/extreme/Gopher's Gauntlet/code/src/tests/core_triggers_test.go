package e_tests

import (
	"context"
	"elemental/core"
	"elemental/tests/setup"
	"elemental/utils"
	"reflect"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestCoreTriggers(t *testing.T) {
	e_test_setup.Connection()
	defer e_test_setup.Teardown()

	var CastleModel = elemental.NewModel[Castle]("Castle-For-Triggers", elemental.NewSchema(map[string]elemental.Field{
		"Name": {
			Type:     reflect.String,
			Required: true,
		},
	}))

	var insertedCastle Castle
	var updatedCastle Castle
	var replacedCastle Castle
	var deletedCastleID primitive.ObjectID
	var collectionDropped bool

	CastleModel.OnInsert(func(castle Castle) {
		insertedCastle = castle
	})

	CastleModel.OnUpdate(func(castle Castle) {
		updatedCastle = castle
	})

	CastleModel.OnReplace(func(castle Castle) {
		replacedCastle = castle
	})

	CastleModel.OnDelete(func(castleId primitive.ObjectID) {
		deletedCastleID = castleId
	})

	CastleModel.OnCollectionDrop(func() {
		collectionDropped = true
	})

	Convey("Triggers", t, func() {
		Convey("Listen to document creation", func() {
			name := "Aretuza"
			CastleModel.Create(Castle{Name: name}).Exec()
			SoTimeout(t, func() (ok bool) {
				if insertedCastle.Name == name {
					ok = true
				}
				return
			})
		})
		Convey("Listen to document update", func() {
			name := "Kaer Morhen"
			CastleModel.UpdateOne(nil, Castle{Name: name}).Where("name", "Aretuza").Exec()
			SoTimeout(t, func() (ok bool) {
				if updatedCastle.Name == name {
					ok = true
				}
				return
			})
		})
		Convey("Listen to document replacement", func() {
			name := "Kaer Trolde"
			CastleModel.ReplaceOne(nil, Castle{Name: name}).Where("name", "Kaer Morhen").Exec()
			SoTimeout(t, func() (ok bool) {
				if replacedCastle.Name == name {
					ok = true
				}
				return
			})
		})
		Convey("Listen to document deletion", func() {
			name := "Kaer Trolde"
			castle := e_utils.Cast[Castle](CastleModel.FindOne(primitive.M{"name": name}).Exec())
			CastleModel.DeleteOne(primitive.M{"name": name}).Exec()
			SoTimeout(t, func() (ok bool) {
				if deletedCastleID == castle.ID {
					ok = true
				}
				return
			})
		})
		Convey("Listen to collection delete", func() {
			CastleModel.Collection().Drop(context.Background())
			SoTimeout(t, func() bool {
				return collectionDropped
			})
		})
	})
}
