package e_tests

import (
	"elemental/core"
	"elemental/tests/setup"
	"elemental/utils"
	"fmt"
	"reflect"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestCoreAudit(t *testing.T) {
	e_test_setup.Connection()
	
	defer e_test_setup.Teardown()

	entity := "Kingdom-For-Audit"

	var KingdomModel = elemental.NewModel[Kingdom](entity, elemental.NewSchema(map[string]elemental.Field{
		"Name": {
			Type:     reflect.String,
			Required: true,
		},
	}))

	KingdomModel.EnableAuditing()

	Convey("Inspect audit records", t, func() {
		Convey("Insert", func() {
			KingdomModel.Create(Kingdom{Name: "Nilfgaard"}).Exec()
			SoTimeout(t, func() (ok bool) {
				audit := e_utils.Cast[elemental.Audit](elemental.AuditModel.FindOne(primitive.M{"entity": entity, "type": elemental.AuditTypeInsert}).Exec())
				fmt.Println(audit)
				if audit.Type != "" {
					ok = true
				}
				return
			})
		})
		Convey("Update", func() {
			KingdomModel.UpdateOne(&primitive.M{"name": "Nilfgaard"}, Kingdom{Name: "Redania"}).Exec()
			SoTimeout(t, func() (ok bool) {
				audit := e_utils.Cast[elemental.Audit](elemental.AuditModel.FindOne(primitive.M{"entity": entity, "type": elemental.AuditTypeUpdate}).Exec())
				if audit.Type != "" {
					ok = true
				}
				return
			})
		})
		Convey("Delete", func() {
			KingdomModel.DeleteOne(primitive.M{"name": "Redania"}).Exec()
			SoTimeout(t, func() (ok bool) {
				audit := e_utils.Cast[elemental.Audit](elemental.AuditModel.FindOne(primitive.M{"entity": entity, "type": elemental.AuditTypeDelete}).Exec())
				if audit.Type != "" {
					ok = true
				}
				return
			})
		})
	})
}
