package e_test_setup

import (
	"context"
	"elemental/connection"
	"elemental/tests/base"
	"elemental/tests/mocks"
	"fmt"
	"runtime"
)

func Connection() {
	e_connection.ConnectURI(e_mocks.DB_URI)
}

func Seed() {
	e_test_base.UserModel.InsertMany(e_mocks.Users).Exec()
}

func SeededConnection() {
	fmt.Printf("Executing seeded connection for Golang version %s", runtime.Version())
	Connection()
	Seed()
}

func Teardown() {
	e_connection.UseDefault().Drop(context.TODO())
	e_connection.Use(e_mocks.SECONDARY_DB).Drop(context.TODO())
	e_connection.Use(e_mocks.TERTIARY_DB).Drop(context.TODO())
	e_connection.Use(e_mocks.TEMPORARY_DB_1).Drop(context.TODO())
	e_connection.Use(e_mocks.TEMPORARY_DB_2).Drop(context.TODO())
	e_connection.Use(e_mocks.TEMPORARY_DB_3).Drop(context.TODO())
	e_connection.Disconnect()
}
