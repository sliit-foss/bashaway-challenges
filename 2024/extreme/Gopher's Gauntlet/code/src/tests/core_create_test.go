package e_tests

import (
	"elemental/connection"
	"elemental/tests/base"
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestCoreCreate(t *testing.T) {

	e_test_setup.Connection()

	defer e_test_setup.Teardown()

	Convey("Create users", t, func() {
		Convey("Create a single user", func() {
			user := UserModel.Create(e_mocks.Ciri).Exec().(User)
			So(user.ID, ShouldNotBeNil)
			So(user.Name, ShouldEqual, e_mocks.Ciri.Name)
			So(user.Age, ShouldEqual, e_test_base.DefaultAge)
			So(user.CreatedAt.Unix(), ShouldBeBetweenOrEqual, time.Now().Add(-10*time.Second).Unix(), time.Now().Unix())
			So(user.UpdatedAt.Unix(), ShouldBeBetweenOrEqual, time.Now().Add(-10*time.Second).Unix(), time.Now().Unix())
		})
		Convey("Create many users", func() {
			users := UserModel.InsertMany(e_mocks.Users[1:]).Exec().([]User)
			So(len(users), ShouldEqual, len(e_mocks.Users[1:]))
			So(users[0].ID, ShouldNotBeNil)
			So(users[1].ID, ShouldNotBeNil)
			So(users[0].Name, ShouldEqual, e_mocks.Geralt.Name)
			So(users[1].Name, ShouldEqual, e_mocks.Eredin.Name)
			So(users[0].Age, ShouldEqual, e_mocks.Geralt.Age)
			So(users[1].Age, ShouldEqual, e_test_base.DefaultAge)
		})
		Convey("Create a single user in a different database", func() {
			user := UserModel.Create(e_mocks.Ciri).SetDatabase(e_mocks.TERTIARY_DB).Exec().(User)
			So(user.ID, ShouldNotBeNil)
			var newUser User
			e_connection.Use(e_mocks.TERTIARY_DB).Collection(UserModel.Collection().Name()).FindOne(nil, primitive.M{"_id": user.ID}).Decode(&newUser)
			So(newUser.Name, ShouldEqual, e_mocks.Ciri.Name)
		})
		Convey("Create a single user in a different collection in a different database", func() {
			user := UserModel.Create(e_mocks.Geralt).SetDatabase(e_mocks.TEMPORARY_DB_1).SetCollection("witchers").Exec().(User)
			So(user.ID, ShouldNotBeNil)
			var newUser User
			e_connection.Use(e_mocks.TEMPORARY_DB_1).Collection("witchers").FindOne(nil, primitive.M{"_id": user.ID}).Decode(&newUser)
			So(newUser.Name, ShouldEqual, e_mocks.Geralt.Name)
		})
	})
	Convey("Create a monster which has a sub schema with defaults", t, func() {
		monster := MonsterModel.Create(Monster{
			Name:     "Katakan",
			Category: "Vampire",
		}).Exec().(Monster)
		So(monster.ID, ShouldNotBeNil)
		So(monster.Name, ShouldEqual, "Katakan")
		So(monster.CreatedAt.Unix(), ShouldBeBetweenOrEqual, time.Now().Add(-10*time.Second).Unix(), time.Now().Unix())
		So(monster.UpdatedAt.Unix(), ShouldBeBetweenOrEqual, time.Now().Add(-10*time.Second).Unix(), time.Now().Unix())
		So(monster.Weaknesses.Signs, ShouldContain, "Igni")
		So(monster.Weaknesses.InvulnerableTo, ShouldContain, "Steel")
	})
}
