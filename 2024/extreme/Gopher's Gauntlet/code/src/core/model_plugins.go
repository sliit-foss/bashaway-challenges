package elemental

import filter_query "elemental/plugins/filter-query"

// QS allows you to construct a MongoDB query directly from the params in a request.
//
// It uses the filter_query plugin to parse the query string and apply filters, sorting, lookups, and projections to the final query.
//
// Usage:
//     UserModel.QS("filter[name]=John&sort[name]=asc&include=field1&select=field1").Exec().([]User)
//
func (m Model[T]) QS(query string) Model[T] {
	result := filter_query.Parse(query)
	if (len(result.Filters) > 0) {
		m = m.Find(result.Filters)
	}
	if (len(result.Include) > 0) {
		m = m.Populate(result.Include)
	}
	if (len(result.SecondaryFilters) > 0) {
		m = m.Find(result.SecondaryFilters)
	}
	if (len(result.Sorts) > 0) {
		m = m.Sort(result.Sorts)
	}
	if (len(result.Select) > 0) {
		m = m.Select(result.Select)
	}
	return m
}
