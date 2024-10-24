package filter_query

import (
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

type FilterQueryResult struct {
	Filters          bson.M
	SecondaryFilters bson.M
	Sorts            bson.M
	Include          []string
	Select           bson.M
	Prepaginate      bool
}

func Parse(queryString string) FilterQueryResult {
	result := FilterQueryResult{}
	result.Filters = bson.M{}
	result.SecondaryFilters = bson.M{}
	result.Sorts = bson.M{}
	result.Select = bson.M{}
	queries := strings.Split(queryString, "&")
	for _, query := range queries {
		if query == "" {
			continue
		}
		pair := strings.Split(query, "=")
		key := pair[0]
		value := pair[1]
		if strings.Contains(key, "filter") {
			filterKey := extractFieldName(key)
			result.Filters[filterKey] = value
		}
		if strings.Contains(key, "secondaryFilter") {
			filterKey := extractFieldName(key)
			result.SecondaryFilters[filterKey] = value
		}
		if strings.Contains(key, "sort") {
			sortKey := extractFieldName(key)
			if value == "asc" || value == "1" {
				result.Sorts[sortKey] = 1
			} else {
				result.Sorts[sortKey] = -1
			}
		}
		if strings.Contains(key, "include") {
			result.Include = append(result.Include, strings.Split(value, ",")...)
		}
		if strings.Contains(key, "select") {
			for _, field := range strings.Split(value, ",") {
				if strings.HasPrefix(field, "-") {
					result.Select[field[1:]] = 0
				} else {
					result.Select[field] = 1
				}
			}
		}
		if strings.Contains(key, "prepaginate") {
			result.Prepaginate = value == "true"
		}
	}
	result.Filters = mapFilters(result.Filters)
	result.SecondaryFilters = mapFilters(result.SecondaryFilters)
	return result
}
