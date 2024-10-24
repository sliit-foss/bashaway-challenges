package e_tests

import (
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"elemental/utils"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCoreDelete(t *testing.T) {

	e_test_setup.SeededConnection()

	defer e_test_setup.Teardown()

	Convey("Delete users", t, func() {
		Convey("Find and delete first user", func() {
			user := e_utils.Cast[User](UserModel.FindOneAndDelete().Exec())
			So(user.Name, ShouldEqual, e_mocks.Ciri.Name)
			So(UserModel.FindByID(user.ID).Exec(), ShouldBeNil)
		})
		Convey("Find and delete user by ID", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Exec())
			So(user.Name, ShouldEqual, e_mocks.Geralt.Name)
			deletedUser := e_utils.Cast[User](UserModel.FindByIdAndDelete(user.ID).Exec())
			So(deletedUser.Name, ShouldEqual, e_mocks.Geralt.Name)
			So(UserModel.FindByID(user.ID).Exec(), ShouldBeNil)
		})
		Convey("Delete a user document", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Exec())
			So(user.Name, ShouldEqual, e_mocks.Eredin.Name)
			UserModel.Delete(user).Exec()
			So(UserModel.FindByID(user.ID).Exec(), ShouldBeNil)
		})
		Convey("Delete a user by ID", func() {
			user := e_utils.Cast[User](UserModel.FindOne().Exec())
			So(user.Name, ShouldEqual, e_mocks.Caranthir.Name)
			UserModel.DeleteByID(user.ID).Exec()
			So(UserModel.FindByID(user.ID).Exec(), ShouldBeNil)
		})
		Convey("Delete all remaining users", func() {
			UserModel.DeleteMany().Exec()
			So(UserModel.Find().Exec(), ShouldBeEmpty)
		})
	})
}
