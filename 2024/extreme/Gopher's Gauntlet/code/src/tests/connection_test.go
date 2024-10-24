package e_tests

import (
	"elemental/connection"
	"elemental/constants"
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestConnection(t *testing.T) {

	defer e_test_setup.Teardown()

	Convey("Connect to a local database", t, func() {
		Convey("Simplest form of connect with just a URI", func() {
			client := e_connection.Connect(e_connection.ConnectionOptions{
				URI: e_mocks.DB_URI,
			})
			So(client, ShouldNotBeNil)
			Convey("Should use the default database", func() {
				So(e_connection.UseDefault().Name(), ShouldEqual, e_mocks.DEFAULT_DB)
			})
			Convey("Should use the specified database", func() {
				So(e_connection.Use(e_mocks.SECONDARY_DB).Name(), ShouldEqual, e_mocks.SECONDARY_DB)
			})
		})
		Convey("Connect with a URI specified within client options", func() {
			opts := options.Client().ApplyURI(e_mocks.DB_URI)
			client := e_connection.Connect(e_connection.ConnectionOptions{
				ClientOptions: opts,
			})
			So(client, ShouldNotBeNil)
		})
		Convey("Connect with no URI", func() {
			So(func() {
				e_connection.Connect(e_connection.ConnectionOptions{})
			}, ShouldPanicWith, e_constants.ErrURIRequired)
		})
	})
}
