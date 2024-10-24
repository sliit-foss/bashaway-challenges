package elemental

import "time"

type ReadPreference struct {
	Mode string `json:"mode"`
}

type ServerInfo struct {
	Version    string `bson:"version" json:"version"`
	GitVersion string `bson:"gitVersion" json:"gitVersion"`
	Host       string `bson:"host" json:"host"`
	Port       int64  `bson:"port" json:"port"`
}

type Shard struct {
	Host   string   `bson:"host" json:"host"`
	State  string   `bson:"state" json:"state"`
	Tags   []string `bson:"tags" json:"tags"`
	Uptime int64    `bson:"uptime" json:"uptime"`
}

type ShardIdentity struct {
	ShardKeyPattern map[string]int64 `bson:"shardKeyPattern" json:"shardKeyPattern"`
	ShardName       string           `bson:"shardName" json:"shardName"`
	UUID            string           `bson:"uuid" json:"uuid"`
}

type UserFlagsData struct {
	Cache struct {
		Reads  int64 `bson:"reads" json:"reads"`
		Writes int64 `bson:"writes" json:"writes"`
	} `bson:"cache" json:"cache"`
}

type WriteConcern struct {
	W        int64 `json:"w"`
	WTimeout int64 `json:"wtimeout"`
}

type CollectionStats struct {
	NS                 string         `bson:"ns" json:"ns"`
	Size               int64          `bson:"size" json:"size"`
	Capped             bool           `bson:"capped" json:"capped"`
	Count              int64          `bson:"count" json:"count"`
	AvgObjSize         int64          `bson:"avgObjSize" json:"avgObjSize"`
	FreeStorageSize    int64          `bson:"freeStorageSize" json:"freeStorageSize"`
	StorageSize        int64          `bson:"storageSize" json:"storageSize"`
	IndexBuilds        []string       `bson:"indexBuilds" json:"indexBuilds"`
	IndexSizes         map[string]int `bson:"indexSizes" json:"indexSizes"`
	TotalIndexSize     int64          `bson:"totalIndexSize" json:"totalIndexSize"`
	NumberOfIndexes    int64          `bson:"nindexes" json:"nindexes"`
	NumberOfOrphanDocs int64          `bson:"numOrphanDocs" json:"numOrphanDocs"`
	OK                 int64          `bson:"ok" json:"ok"`
	OperationTime      time.Time      `bson:"operationTime" json:"operationTime"`
	ReadOnly           bool           `bson:"readOnly" json:"readOnly"`
	ReadPreference     ReadPreference `bson:"readPreference" json:"readPreference"`
	RejectedPlans      []string       `bson:"rejectedPlans" json:"rejectedPlans"`
	ServerInfo         ServerInfo     `bson:"serverInfo" json:"serverInfo"`
	ShardIdentity      ShardIdentity  `bson:"shardIdentity" json:"shardIdentity"`
	Shards             []Shard        `bson:"shards" json:"shards"`
	UserFlags          int64          `bson:"userFlags" json:"userFlags"`
	UserFlagsData      UserFlagsData  `bson:"userFlagsData" json:"userFlagsData"`
	WriteConcern       WriteConcern   `bson:"writeConcern" json:"writeConcern"`
}
