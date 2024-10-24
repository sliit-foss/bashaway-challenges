package e_utils

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Extracts and returns the query from an optional slice of queries. If the slice is empty, it returns an empty query.
func DefaultQuery(query ...primitive.M) primitive.M {
	if len(query) == 0 {
		return primitive.M{}
	}
	return query[0]
}
