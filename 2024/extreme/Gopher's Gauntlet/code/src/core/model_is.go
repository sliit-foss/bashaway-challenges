package elemental

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsontype"
)

func (m Model[T]) IsType(value bsontype.Type) Model[T] {
	return m.addToFilters("$type", value)
}

func (m Model[T]) IsNull() Model[T] {
	return m.addToFilters("$type", bson.TypeNull)
}

func (m Model[T]) IsBoolean() Model[T] {
	return m.addToFilters("$type", bson.TypeBoolean)
}

func (m Model[T]) IsInt32() Model[T] {
	return m.addToFilters("$type", bson.TypeInt32)
}

func (m Model[T]) IsInt64() Model[T] {
	return m.addToFilters("$type", bson.TypeInt64)
}

func (m Model[T]) IsDouble() Model[T] {
	return m.addToFilters("$type", bson.TypeDouble)
}

func (m Model[T]) IsString() Model[T] {
	return m.addToFilters("$type", bson.TypeString)
}

func (m Model[T]) IsArray() Model[T] {
	return m.addToFilters("$type", bson.TypeArray)
}

func (m Model[T]) IsBinary() Model[T] {
	return m.addToFilters("$type", bson.TypeBinary)
}

func (m Model[T]) IsUndefined() Model[T] {
	return m.addToFilters("$type", bson.TypeUndefined)
}

func (m Model[T]) IsObjectID() Model[T] {
	return m.addToFilters("$type", bson.TypeObjectID)
}

func (m Model[T]) IsDateTime() Model[T] {
	return m.addToFilters("$type", bson.TypeDateTime)
}

func (m Model[T]) IsRegex() Model[T] {
	return m.addToFilters("$type", bson.TypeRegex)
}

func (m Model[T]) IsDBPointer() Model[T] {
	return m.addToFilters("$type", bson.TypeDBPointer)
}

func (m Model[T]) IsJavaScript() Model[T] {
	return m.addToFilters("$type", bson.TypeJavaScript)
}

func (m Model[T]) IsSymbol() Model[T] {
	return m.addToFilters("$type", bson.TypeSymbol)
}

func (m Model[T]) IsCodeWithScope() Model[T] {
	return m.addToFilters("$type", bson.TypeCodeWithScope)
}

func (m Model[T]) IsTimestamp() Model[T] {
	return m.addToFilters("$type", bson.TypeTimestamp)
}

func (m Model[T]) IsDecimal128() Model[T] {
	return m.addToFilters("$type", bson.TypeDecimal128)
}

func (m Model[T]) IsMinKey() Model[T] {
	return m.addToFilters("$type", bson.TypeMinKey)
}

func (m Model[T]) IsMaxKey() Model[T] {
	return m.addToFilters("$type", bson.TypeMaxKey)
}

func (m Model[T]) IsBinaryGeneric() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryGeneric)
}

func (m Model[T]) IsBinaryFunction() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryFunction)
}

func (m Model[T]) IsBinaryBinaryOld() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryBinaryOld)
}

func (m Model[T]) IsBinaryUUIDOld() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryUUIDOld)
}

func (m Model[T]) IsBinaryUUID() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryUUID)
}

func (m Model[T]) IsBinaryMD5() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryMD5)
}

func (m Model[T]) IsBinaryEncrypted() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryEncrypted)
}

func (m Model[T]) IsBinaryColumn() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryColumn)
}

func (m Model[T]) IsBinarySensitive() Model[T] {
	return m.addToFilters("$type", bson.TypeBinarySensitive)
}

func (m Model[T]) IsBinaryUserDefined() Model[T] {
	return m.addToFilters("$type", bson.TypeBinaryUserDefined)
}
