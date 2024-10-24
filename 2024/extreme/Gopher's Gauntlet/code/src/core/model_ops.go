package elemental

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (m Model[T]) Equals(value any) Model[T] {
	return m.addToFilters("$eq", value)
}

func (m Model[T]) NotEquals(value any) Model[T] {
	return m.addToFilters("$ne", value)
}

func (m Model[T]) LessThan(value any) Model[T] {
	return m.addToFilters("$lt", value)
}

func (m Model[T]) GreaterThan(value any) Model[T] {
	return m.addToFilters("$gt", value)
}

func (m Model[T]) LessThanOrEquals(value any) Model[T] {
	return m.addToFilters("$lte", value)
}

func (m Model[T]) GreaterThanOrEquals(value any) Model[T] {
	return m.addToFilters("$gte", value)
}

func (m Model[T]) Between(min, max any) Model[T] {
	return m.addToFilters("$gte", min).addToFilters("$lte", max)
}

func (m Model[T]) Mod(divisor, remainder int) Model[T] {
	return m.addToFilters("$mod", []int{divisor, remainder})
}

func (m Model[T]) Regex(pattern string) Model[T] {
	return m.addToFilters("$regex", primitive.Regex{Pattern: pattern, Options: ""})
}

func (m Model[T]) Exists(value bool) Model[T] {
	return m.addToFilters("$exists", value)
}

func (m Model[T]) In(values ...any) Model[T] {
	return m.addToFilters("$in", values)
}

func (m Model[T]) NotIn(values ...any) Model[T] {
	return m.addToFilters("$nin", values)
}

func (m Model[T]) ElementMatches(query primitive.M) Model[T] {
	return m.addToFilters("$elemMatch", query)
}

func (m Model[T]) Size(value int) Model[T] {
	return m.addToFilters("$size", value)
}

func (m Model[T]) Or() Model[T] {
	m.orConditionActive = true
	return m
}
