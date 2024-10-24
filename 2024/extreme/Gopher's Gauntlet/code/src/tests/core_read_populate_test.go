package e_tests

import (
	"elemental/tests/setup"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCoreReadPopulate(t *testing.T) {

	e_test_setup.Connection()

	defer e_test_setup.Teardown()

	monsters := MonsterModel.InsertMany([]Monster{
		{
			Name:     "Katakan",
			Category: "Vampire",
		},
		{
			Name:     "Drowner",
			Category: "Drowner",
		},
		{
			Name:     "Nekker",
			Category: "Nekker",
		},
	}).Exec().([]Monster)

	kingdoms := KingdomModel.InsertMany([]Kingdom{
		{
			Name: "Nilfgaard",
		},
		{
			Name: "Redania",
		},
		{
			Name: "Skellige",
		},
	}).Exec().([]Kingdom)

	BestiaryModel.InsertMany([]Bestiary{
		{
			Monster: monsters[0],
			Kingdom: kingdoms[0],
		},
		{
			Monster: monsters[1],
			Kingdom: kingdoms[1],
		},
		{
			Monster: monsters[2],
			Kingdom: kingdoms[2],
		},
	}).Exec()

	Convey("Find with populated fields", t, func() {
		Convey("Populate a with multiple calls", func() {
			bestiary := BestiaryModel.Find().Populate("monster").Populate("kingdom").Exec().([]Bestiary)
			So(bestiary, ShouldHaveLength, 3)
			So(bestiary[0].Monster.Name, ShouldEqual, "Katakan")
			So(bestiary[0].Kingdom.Name, ShouldEqual, "Nilfgaard")
		})
		Convey("Populate with a single call", func() {
			bestiary := BestiaryModel.Find().Populate("monster", "kingdom").Exec().([]Bestiary)
			So(bestiary, ShouldHaveLength, 3)
			So(bestiary[0].Monster.Name, ShouldEqual, "Katakan")
			So(bestiary[0].Kingdom.Name, ShouldEqual, "Nilfgaard")
		})
		Convey("Populate with a single call (Comma separated string)", func() {
			bestiary := BestiaryModel.Find().Populate("monster kingdom").Exec().([]Bestiary)
			So(bestiary, ShouldHaveLength, 3)
			So(bestiary[0].Monster.Name, ShouldEqual, "Katakan")
			So(bestiary[0].Kingdom.Name, ShouldEqual, "Nilfgaard")
		})
	})
}
