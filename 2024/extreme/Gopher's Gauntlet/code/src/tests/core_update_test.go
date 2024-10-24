package e_tests

import (
	"elemental/tests/base"
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"elemental/utils"
	"testing"

	"github.com/samber/lo"
	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestCoreUpdate(t *testing.T) {

	e_test_setup.SeededConnection()

	defer e_test_setup.Teardown()

	Convey("Update users", t, func() {
		Convey("Find and update first user", func() {
			user := e_utils.Cast[User](UserModel.FindOneAndUpdate(nil, primitive.M{"name": "Zireael"}).Exec())
			So(user.Name, ShouldEqual, e_mocks.Ciri.Name)
			updatedUser := e_utils.Cast[User](UserModel.FindOne(primitive.M{"name": "Zireael"}).Exec())
			So(updatedUser.Age, ShouldEqual, e_test_base.DefaultAge)
		})
		Convey("Find and update first user and return updated document", func() {
			opts := options.FindOneAndUpdateOptions{}
			opts.SetReturnDocument(options.After)
			user := e_utils.Cast[User](UserModel.FindOneAndUpdate(nil, User{
				Name: "Zireael",
			}, &opts).Exec())
			So(user.Name, ShouldEqual, "Zireael")
			Convey("In conjunction with New", func() {
				user := e_utils.Cast[User](UserModel.FindOneAndUpdate(nil, User{
					Name: "Swallow",
				}).New().Exec())
				So(user.Name, ShouldEqual, "Swallow")
			})
		})
		Convey("Find and update user by ID", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Geralt.Name).Exec())
			updatedUser := e_utils.Cast[User](UserModel.FindByIDAndUpdate(user.ID, User{
				Name: "White Wolf",
			}).Exec())
			So(updatedUser.Name, ShouldEqual, e_mocks.Geralt.Name)
			So(updatedUser.Age, ShouldEqual, e_mocks.Geralt.Age)
			updatedUser = e_utils.Cast[User](UserModel.FindByID(user.ID).Exec())
			So(updatedUser.Name, ShouldEqual, "White Wolf")
		})
		Convey("Update user with upsert", func() {
			UserModel.UpdateOne(&primitive.M{"name": "Triss"}, User{
				Name: "Triss",
			}).Upsert().Exec()
			So(UserModel.Where("name", "Triss").Exec(), ShouldHaveLength, 1)
		})
		Convey("Update user by ID", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", "Triss").Exec())
			UserModel.UpdateByID(user.ID, User{
				Name: "Triss Merigold",
			}).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindByID(user.ID).Exec())
			So(updatedUser.Name, ShouldEqual, "Triss Merigold")
		})
		Convey("Update a user document", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Eredin.Name).Exec())
			user.Age = 200
			UserModel.Save(user).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindByID(user.ID).Exec())
			So(updatedUser.Age, ShouldEqual, 200)
		})
		Convey("Find and replace first user", func() {
			user := e_utils.Cast[User](UserModel.FindOneAndReplace(nil, User{
				Name: "Zireael",
			}).Exec())
			So(user.Name, ShouldEqual, "Swallow")
			updatedUser := e_utils.Cast[User](UserModel.FindOne(primitive.M{"name": "Zireael"}).Exec())
			So(updatedUser.Age, ShouldEqual, 0)
		})
		Convey("Find and replace user by ID", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Imlerith.Name).Exec())
			updatedUser := e_utils.Cast[User](UserModel.FindByIDAndReplace(user.ID, User{
				Name: "Imlerith",
				Age:  151,
			}).Exec())
			So(updatedUser.Name, ShouldEqual, e_mocks.Imlerith.Name)
			updatedUser = e_utils.Cast[User](UserModel.FindByID(user.ID).Exec())
			So(updatedUser.Age, ShouldEqual, 151)
			So(updatedUser.Occupation, ShouldBeZeroValue)
		})
		Convey("Update all remaining users to have only daggers", func() {
			UserModel.UpdateMany(nil, User{
				Weapons: []string{"Dagger"},
			}).Exec()
			users := UserModel.Where("weapons", "Dagger").Exec()
			So(users, ShouldHaveLength, len(e_mocks.Users)+1)
		})
		Convey("Increment age of a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Inc("age", 1).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Age, ShouldEqual, e_mocks.Vesemir.Age+1)
		})
		Convey("Decrement age of a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Dec("age", 1).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Age, ShouldEqual, e_mocks.Vesemir.Age)
		})
		Convey("Multiply age of a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Mul("age", 2).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Age, ShouldEqual, e_mocks.Vesemir.Age*2)
		})
		Convey("Divide age of a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Div("age", 2).Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Age, ShouldEqual, e_mocks.Vesemir.Age)
		})
		Convey("Rename occupation field to profession", func() {
			UserModel.Rename("occupation", "profession").Exec()
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(user.Occupation, ShouldBeZeroValue)
		})
		Convey("Unset school of a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Unset("school").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.School, ShouldBeZeroValue)
		})
		Convey("Add a weapon to a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Push("weapons", "Xiphos").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Weapons, ShouldContain, "Xiphos")
		})
		Convey("Add multiple weapons to a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Push("weapons", "Ulfberht", "Mace").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Weapons, ShouldContain, "Xiphos")
			So(updatedUser.Weapons, ShouldContain, "Ulfberht")
			So(updatedUser.Weapons, ShouldContain, "Mace")
		})
		Convey("Remove a weapon from a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).Pull("weapons", "Xiphos").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Weapons, ShouldNotContain, "Xiphos")
		})
		Convey("Remove multiple weapons from a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).PullAll("weapons", "Ulfberht", "Mace").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(updatedUser.Weapons, ShouldNotContain, "Ulfberht")
			So(updatedUser.Weapons, ShouldNotContain, "Mace")
		})
		Convey("Remove last weapon from a user", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			UserModel.Where("name", e_mocks.Vesemir.Name).Pop("weapons").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(len(updatedUser.Weapons), ShouldEqual, len(user.Weapons)-1)
		})
		Convey("Try adding the same weapon multiple times to a user", func() {
			UserModel.Where("name", e_mocks.Vesemir.Name).AddToSet("weapons", "Longsword", "Longsword", "Longsword").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(len(lo.Filter(updatedUser.Weapons, func(w string, _ int) bool {
				return w == "Longsword"
			})), ShouldEqual, 1)
		})
		Convey("Remove first weapon from a user", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			UserModel.Where("name", e_mocks.Vesemir.Name).Shift("weapons").Exec()
			updatedUser := e_utils.Cast[User](UserModel.FindOne().Where("name", e_mocks.Vesemir.Name).Exec())
			So(len(updatedUser.Weapons), ShouldEqual, len(user.Weapons)-1)
		})
	})
}
