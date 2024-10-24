package request_validator

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
)
type User struct {
	ID       int    `validate:"exists=user_table,UserId"`
	Name     string `validate:"exists=user_table,Name"`
	Age      int    `validate:"IsGreater=20"`
	IsActive bool   `validate:"isTrue"`
}

// check object tags and validate agaist database

func ValidateStructWithDB(input interface{}) error {
	v := reflect.ValueOf(input)
	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		value := fmt.Sprintf("%v", v.Field(i))
		tag := strings.Split(field.Tag.Get("validate"), "=")
		switch tag[0] {
			case "exists":
				params := strings.Split(tag[1], ",")
				table := params[0]
				column := params[1]
				// Perform database lookup to check existence

				// if input != nil {
				// 	fieldValue := reflect.ValueOf(input).FieldByName(field.Name)
				// 	if !checkExistence( column, fieldValue.Interface()) {
				// 		return fmt.Errorf("%s does not exist in %s", column, table)
				// 	}
				// }
				// fmt.Println("Checking if the %v exists in the database")
				fmt.Printf("Checking if the %s with value %s exists in the %s table, column %s\n", field.Name, value, table, column)
				// return nil

			case "IsGreater":
				params := strings.Split(tag[1], ",")
				threshold, _ := strconv.Atoi(params[0])
				//chek if the dataset has a larger value

				// if !checkIsGreater(threshold, field.Name) {
				// 	return fmt.Errorf("%s is not greater than %d", field.Name, threshold)
				// }
				fmt.Printf("Checking if the %s is greater than %d\n", field.Name, threshold)
				// return nil

			case "isTrue":
				//pass the value of the field to checkIsTrue function

				// key, _ := strconv.Atoi(v.Field(0).Interface().(string))
				// if !checkIsTrue(field.Name, key) {
				// 	return fmt.Errorf("%s is not true", field.Name)
				// }
				fmt.Printf("Checking if the %s is true\n", field.Name)
				// return nil
			}
		
	}
	return nil
}

// var users = data.Users

// func checkExistence( column string, value interface{}) bool {	
// 	for _, user := range users {
// 		if reflect.ValueOf(user).FieldByName(column).Interface() == value {
// 			return true
// 		}
// 	}
// 	return false
// }

// func checkIsGreater(threshold int, feildName string) bool {
// 	for _, user := range users {
// 		if reflect.ValueOf(user).FieldByName(feildName).Interface().(int) > threshold {
// 			return true
// 		}
// 	}
// 	return false
// }

// func checkIsTrue(feildName string, id int) bool {
// 	for _, user := range users {
// 		if user.ID == id && reflect.ValueOf(user).FieldByName(feildName).Interface().(bool){
// 			return true
// 		}
// 	}
// 	return false
// }