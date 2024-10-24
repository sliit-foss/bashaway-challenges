package e_tests

import (
	"elemental/tests/mocks"
	"elemental/tests/setup"
	"fmt"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCoreMeta(t *testing.T) {

	e_test_setup.SeededConnection()

	defer e_test_setup.Teardown()

	Convey("Metadata", t, func() {
		Convey(fmt.Sprintf("Estimated document count should be %d", len(e_mocks.Users)), func() {
			count := UserModel.EstimatedDocumentCount()
			So(count, ShouldEqual, len(e_mocks.Users))
		})
		Convey("Stats", func() {
			Convey("As a whole", func() {
				stats := UserModel.Stats()
				So(stats.Count, ShouldEqual, len(e_mocks.Users))
				So(stats.AvgObjSize, ShouldBeGreaterThan, 0)
				So(stats.Size, ShouldBeGreaterThan, 0)
				So(stats.StorageSize, ShouldBeGreaterThan, 0)
			})
			Convey("Just the total size", func() {
				size := UserModel.TotalSize()
				So(size, ShouldBeGreaterThan, 0)
			})
			Convey("Just the storage size", func() {
				size := UserModel.StorageSize()
				So(size, ShouldBeGreaterThan, 0)
			})
			Convey("Just the total index size", func() {
				size := UserModel.TotalIndexSize()
				So(size, ShouldBeGreaterThan, 0)
			})
			Convey("Just the average object size", func() {
				size := UserModel.AvgObjSize()
				So(size, ShouldBeGreaterThan, 0)
			})
			Convey("Just the index count", func() {
				size := UserModel.NumberOfIndexes()
				So(size, ShouldBeGreaterThanOrEqualTo, 1)
			})
		})
	})
}
