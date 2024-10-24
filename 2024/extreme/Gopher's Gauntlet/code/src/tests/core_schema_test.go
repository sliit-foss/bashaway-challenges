package e_tests

import (
	"elemental/core"
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"fmt"
	"reflect"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestCoreSchemaOptions(t *testing.T) {
	e_test_setup.Connection()
	defer e_test_setup.Teardown()

	Convey("Schema variations", t, func() {
		Convey(fmt.Sprintf("Should use the default database of %s", e_mocks.DEFAULT_DB), func() {
			So(UserModel.Collection().Database().Name(), ShouldEqual, e_mocks.DEFAULT_DB)
		})
		Convey("Should automatically create a collection with given name", func() {
			So(UserModel.Collection().Name(), ShouldEqual, "users")
		})
		Convey("Collection should be a plural of the model name if not specified", func() {
			var CastleModel = elemental.NewModel[Castle]("Castle", elemental.NewSchema(map[string]elemental.Field{
				"Name": {
					Type:     reflect.String,
					Required: true,
				},
			}))
			CastleModel.Create(Castle{Name: "Kaer Morhen"}).Exec()
			So(CastleModel.Collection().Name(), ShouldEqual, "castles")
		})
		Convey("Should create a capped collection", func() {
			collectionOptions := options.CreateCollectionOptions{}
			collectionOptions.SetCapped(true)
			collectionOptions.SetSizeInBytes(1024)
			var KingdomModel = elemental.NewModel[Kingdom]("Kingdom-Temporary", elemental.NewSchema(map[string]elemental.Field{
				"Name": {
					Type:     reflect.String,
					Required: true,
				},
			}, elemental.SchemaOptions{
				CollectionOptions: collectionOptions,
			}))
			KingdomModel.Create(Kingdom{Name: "Nilfgaard"}).Exec()
			So(KingdomModel.IsCapped(), ShouldBeTrue)
		})
		Convey("Should use the specified database", func() {
			var MonsterModel = elemental.NewModel[Monster]("Monster-Temporary", elemental.NewSchema(map[string]elemental.Field{
				"Name": {
					Type:     reflect.String,
					Required: true,
				},
			}, elemental.SchemaOptions{
				Database: e_mocks.SECONDARY_DB,
			}))
			MonsterModel.Create(Monster{Name: "Nekker"}).Exec()
			So(MonsterModel.Collection().Database().Name(), ShouldEqual, e_mocks.SECONDARY_DB)
		})
		Convey("Should validate a document against the schema", func() {
			So(func() {
				UserModel.Validate(User{})
			}, ShouldPanicWith, "Field Name is required")
		})
	})
}
