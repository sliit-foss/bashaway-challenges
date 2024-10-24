package e_tests

import (
	filter_query "elemental/plugins/filter-query"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestPluginFilterQuery(t *testing.T) {

	Convey("Filters", t, func() {
		Convey("Basic Syntax", func() {
			Convey("Equality", func() {
				result := filter_query.Parse("filter[name]=John")
				So(result.Filters, ShouldResemble, bson.M{"name": "John"})
			})
		})
		Convey("Advanced Syntax", func() {
			Convey("Equality", func() {
				result := filter_query.Parse("filter[name]=eq(John)")
				So(result.Filters, ShouldResemble, bson.M{"name": bson.M{"$eq": "John"}})
			})
			Convey("Inequality", func() {
				result := filter_query.Parse("filter[age]=ne(30)")
				So(result.Filters, ShouldResemble, bson.M{"age": bson.M{"$ne": 30.0}})
			})
			Convey("Greater Than", func() {
				result := filter_query.Parse("filter[age]=gt(30)")
				So(result.Filters, ShouldResemble, bson.M{"age": bson.M{"$gt": 30.0}})
			})
			Convey("Less Than", func() {
				result := filter_query.Parse("filter[age]=lt(30)")
				So(result.Filters, ShouldResemble, bson.M{"age": bson.M{"$lt": 30.0}})
			})
			Convey("Greater Than or Equal", func() {
				result := filter_query.Parse("filter[age]=gte(30)")
				So(result.Filters, ShouldResemble, bson.M{"age": bson.M{"$gte": 30.0}})
			})
			Convey("Less Than or Equal", func() {
				result := filter_query.Parse("filter[age]=lte(30)")
				So(result.Filters, ShouldResemble, bson.M{"age": bson.M{"$lte": 30.0}})
			})
			Convey("In", func() {
				result := filter_query.Parse("filter[name]=in(John,Jane)")
				So(result.Filters, ShouldResemble, bson.M{"name": bson.M{"$in": []interface{}{"John", "Jane"}}})
			})
			Convey("Not In", func() {
				result := filter_query.Parse("filter[name]=nin(John,Jane)")
				So(result.Filters, ShouldResemble, bson.M{"name": bson.M{"$nin": []interface{}{"John", "Jane"}}})
			})
			Convey("Regex", func() {
				result := filter_query.Parse("filter[name]=reg(^J)")
				So(result.Filters, ShouldResemble, bson.M{"name": bson.M{"$regex": primitive.Regex{Pattern: "^J", Options: ""}}})
			})
			Convey("Exists", func() {
				result := filter_query.Parse("filter[name]=exists(true)")
				So(result.Filters, ShouldResemble, bson.M{"name": bson.M{"$exists": true}})
			})
		})
		Convey("When not present in query string", func() {
			result := filter_query.Parse("")
			So(len(result.Filters), ShouldEqual, 0)
		})
	})

	Convey("Sorts", t, func() {
		Convey("Ascending", func() {
			result := filter_query.Parse("sort[name]=asc")
			So(result.Sorts, ShouldResemble, bson.M{"name": 1})
		})
		Convey("Ascending with 1", func() {
			result := filter_query.Parse("sort[name]=1")
			So(result.Sorts, ShouldResemble, bson.M{"name": 1})
		})
		Convey("Descending", func() {
			result := filter_query.Parse("sort[name]=desc")
			So(result.Sorts, ShouldResemble, bson.M{"name": -1})
		})
		Convey("Descending with -1", func() {
			result := filter_query.Parse("sort[name]=-1")
			So(result.Sorts, ShouldResemble, bson.M{"name": -1})
		})
		Convey("When not present in query string", func() {
			result := filter_query.Parse("")
			So(len(result.Sorts), ShouldEqual, 0)
		})
	})

	Convey("Include", t, func() {
		Convey("When present in query string", func() {
			result := filter_query.Parse("include=field1,field2")
			So(result.Include, ShouldResemble, []string{"field1", "field2"})
		})
		Convey("When not present in query string", func() {
			result := filter_query.Parse("")
			So(len(result.Include), ShouldEqual, 0)
		})
	})

	Convey("Select", t, func() {
		Convey("When present in query string", func() {
			result := filter_query.Parse("select=field1,field2")
			So(result.Select, ShouldResemble, bson.M{"field1": 1, "field2": 1})
		})
		Convey("When present in query string with exclusion", func() {
			result := filter_query.Parse("select=-field1,field2")
			So(result.Select, ShouldResemble, bson.M{"field1": 0, "field2": 1})
		})
		Convey("When not present in query string", func() {
			result := filter_query.Parse("")
			So(len(result.Select), ShouldEqual, 0)
		})
	})

	Convey("Prepaginate", t, func() {
		Convey("When present in query string as true", func() {
			result := filter_query.Parse("prepaginate=true")
			So(result.Prepaginate, ShouldBeTrue)
		})
		Convey("When present in query string as false", func() {
			result := filter_query.Parse("prepaginate=false")
			So(result.Prepaginate, ShouldBeFalse)
		})
		Convey("When not present in query string", func() {
			result := filter_query.Parse("")
			So(result.Prepaginate, ShouldBeFalse)
		})
	})
}
