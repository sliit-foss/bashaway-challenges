package e_mocks

import (
	"elemental/tests/base"
	"os"
)

var (
	DB_URI         = os.Getenv("DB_URI")
	DEFAULT_DB     = "elemental"
	SECONDARY_DB   = "elemental_secondary"
	TERTIARY_DB    = "elemental_tertiary"
	TEMPORARY_DB_1 = "elemental_temporary_1"
	TEMPORARY_DB_2 = "elemental_temporary_2"
	TEMPORARY_DB_3 = "elemental_temporary_3"
)

var (
	WolfSchool      = "Wolf"
	BearSchool      = "Bear"
	GriffinSchool   = "Griffin"
	ManticoreSchool = "Manticore"
)

var (
	Ciri = e_test_base.User{
		Name: "Ciri",
	}
	Geralt = e_test_base.User{
		Name:       "Geralt",
		Age:        100,
		Occupation: "Witcher",
		Weapons:    []string{"Silver sword", "Mahakaman battle hammer", "Battle Axe", "Crossbow", "Steel sword"},
		School:     &WolfSchool,
	}
	Eredin = e_test_base.User{
		Name: "Eredin",
	}
	Caranthir = e_test_base.User{
		Name:       "Caranthir",
		Age:        120,
		Occupation: "Mage",
		Weapons:    []string{"Staff"},
	}
	Imlerith = e_test_base.User{
		Name:       "Imlerith",
		Age:        150,
		Occupation: "General",
		Weapons:    []string{"Mace", "Battle Axe"},
	}
	Yennefer = e_test_base.User{
		Name:       "Yennefer",
		Occupation: "Mage",
		Age:        100,
	}
	Vesemir = e_test_base.User{
		Name:       "Vesemir",
		Occupation: "Witcher",
		Age:        300,
		Weapons:    []string{"Silver sword", "Steel sword", "Crossbow"},
		Retired:    true,
		School:     &WolfSchool,
	}
)

var Users = []e_test_base.User{
	Ciri,
	Geralt,
	Eredin,
	Caranthir,
	Imlerith,
	Yennefer,
	Vesemir,
}
