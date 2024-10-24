package elemental

import (
	"context"
	"elemental/utils"

	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (m Model[T]) Limit(limit int64) Model[T] {
	m.pipeline = append(m.pipeline, bson.D{{Key: "$limit", Value: limit}})
	return m
}

func (m Model[T]) Skip(skip int64) Model[T] {
	for i, stage := range m.pipeline {
		if stage[0].Key == "$limit" {
			newPipeline := make([]bson.D, len(m.pipeline)+1)
			copy(newPipeline, m.pipeline[:i])
			newPipeline[i] = bson.D{{Key: "$skip", Value: skip}}
			copy(newPipeline[i+1:], m.pipeline[i:])
			m.pipeline = newPipeline
			return m
		}
	}
	m.pipeline = append(m.pipeline, bson.D{{Key: "$skip", Value: skip}})
	return m
}

func (m Model[T]) Paginate(page, limit int64) Model[T] {
	m = m.Skip((page - 1) * limit).Limit(limit)
	m.pipeline = []bson.D{{{Key: "$facet", Value: primitive.M{
		"docs": m.pipeline,
		"count": []primitive.M{
			{"$count": "count"},
		},
	}}}}
	m.executor = func(m Model[T], ctx context.Context) any {
		var results []facetResult[T]
		e_utils.Must(lo.Must(m.Collection().Aggregate(ctx, m.pipeline)).All(ctx, &results))
		totalDocs := results[0].Count[0]["count"]
		totalPages := (totalDocs + limit - 1) / limit
		var prevPage, nextPage *int64
		prevPage = lo.ToPtr(page - 1)
		if lo.FromPtr(prevPage) < 1 {
			prevPage = nil
		}
		nextPage = lo.ToPtr(page + 1)
		if lo.FromPtr(nextPage) > totalPages {
			nextPage = nil
		}
		return PaginateResult[T]{
			Docs:       results[0].Docs,
			TotalDocs:  totalDocs,
			Page:       page,
			Limit:      limit,
			TotalPages: totalPages,
			NextPage:   nextPage,
			PrevPage:   prevPage,
			HasPrev:    page > 1,
			HasNext:    page < totalPages,
		}
	}
	return m
}
