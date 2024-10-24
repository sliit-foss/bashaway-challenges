package data


type User struct {
	ID       int    `validate:"exists=user_table,id"`
	Name     string `validate:"exists=user_table,name"`
	Age      int    `validate:"IsGreater=18,1"`
	IsActive bool   `validate:"isTrue"`
}

var Users = []User{
	{
		ID:       1,
		Name:     "John Doe",
		Age:      25,
		IsActive: true,
	},
	{
		ID:       2,
		Name:     "Jane Smith",
		Age:      30,
		IsActive: true,
	},
	{
		ID:       3,
		Name:     "Bob Johnson",
		Age:      40,
		IsActive: false,
	},
	{
		ID:       4,
		Name:     "Alice Williams",
		Age:      22,
		IsActive: true,
	},
	{
		ID:       5,
		Name:     "Mike Davis",
		Age:      35,
		IsActive: true,
	},
}