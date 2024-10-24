package elemental

import (
	"context"
	"elemental/constants"
	"elemental/utils"
	"reflect"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuditType string

const (
	AuditTypeInsert AuditType = "insert"
	AuditTypeUpdate AuditType = "update"
	AuditTypeDelete AuditType = "delete"
)

type Audit struct {
	Entity    string             `json:"entity" bson:"entity"`
	Type      AuditType          `json:"type" bson:"type"`
	Document  primitive.M        `json:"document" bson:"document"`
	User      string            `json:"user" bson:"user"`
	CreatedAt primitive.DateTime `json:"created_at" bson:"created_at"`
	UpdatedAt primitive.DateTime `json:"updated_at" bson:"updated_at"`
}

var AuditModel = NewModel[Audit]("Audit", NewSchema(map[string]Field{
	"Entity": {
		Type:     reflect.String,
		Required: true,
	},
	"Type": {
		Type: reflect.String,
	},
	"Document": {
		Type:     reflect.Map,
		Required: true,
	},
	"User": {
		Type: reflect.String,
	},
}, SchemaOptions{
	Collection: "audits",
}))

func (m Model[T]) EnableAuditing(ctx ...context.Context) {
	context := e_utils.DefaultCTX(ctx)
	user := e_utils.Cast[string](context.Value(e_constants.CTXUser))
	m.OnInsert(func(doc T) {
		AuditModel.Create(Audit{
			Entity:   m.Name,
			Type:     AuditTypeInsert,
			Document: *e_utils.ToBSONDoc(doc),
			User:     user,
		}).Exec(context)
	}, TriggerOptions{Context: &context, Filter: &primitive.M{"ns.coll": primitive.M{"$eq": m.Collection().Name()}}})
	m.OnUpdate(func(doc T) {
		AuditModel.Create(Audit{
			Entity:   m.Name,
			Type:     AuditTypeUpdate,
			Document: *e_utils.ToBSONDoc(doc),
			User:     user,
		}).Exec(context)
	}, TriggerOptions{Context: &context, Filter: &primitive.M{"ns.coll": primitive.M{"$eq": m.Collection().Name()}}})
	m.OnDelete(func(id primitive.ObjectID) {
		AuditModel.Create(Audit{
			Entity:   m.Name,
			Type:     AuditTypeDelete,
			Document: map[string]interface{}{"_id": id},
			User:     user,
		}).Exec(context)
	}, TriggerOptions{Context: &context, Filter: &primitive.M{"ns.coll": primitive.M{"$eq": m.Collection().Name()}}})
}
