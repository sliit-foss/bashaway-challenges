package elemental

type PaginateResult[T any] struct {
	Docs       []T    `json:"docs"`
	TotalDocs  int64  `json:"totalDocs"`
	Page       int64  `json:"page"`
	Limit      int64  `json:"limit"`
	TotalPages int64  `json:"totalPages"`
	NextPage   *int64 `json:"nextPage"`
	PrevPage   *int64 `json:"prevPage"`
	HasPrev    bool   `json:"hasPrev"`
	HasNext    bool   `json:"hasNext"`
}

type facetResult[T any] struct {
	Docs  []T                `bson:"docs"`
	Count []map[string]int64 `bson:"count"`
}
