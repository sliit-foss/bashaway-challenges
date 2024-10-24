package e_connection

import (
	"context"
	"elemental/constants"
	"elemental/utils"
	"github.com/samber/lo"
	"go.mongodb.org/mongo-driver/event"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"go.mongodb.org/mongo-driver/x/mongo/driver/connstring"
	"golang.org/x/exp/maps"
	"time"
)

const connectionTimeout = 30 * time.Second

var clients = make(map[string]mongo.Client)
var defaultDatabases = make(map[string]string)

type ConnectionOptions struct {
	Alias         string
	URI           string
	ClientOptions *options.ClientOptions
	PoolMonitor   *event.PoolMonitor
}

func Connect(opts ConnectionOptions) mongo.Client {
	opts.Alias = e_utils.Coalesce(opts.Alias, "default")
	clientOpts := e_utils.Coalesce(opts.ClientOptions, options.Client()).SetServerAPIOptions(options.ServerAPI(options.ServerAPIVersion1)).SetPoolMonitor(e_utils.Coalesce(opts.PoolMonitor, poolMonitor(opts.Alias)))
	if clientOpts.GetURI() == "" {
		clientOpts = clientOpts.ApplyURI(opts.URI)
		if clientOpts.GetURI() == "" {
			panic(e_constants.ErrURIRequired)
		}
	}
	cs := lo.Must(connstring.ParseAndValidate(clientOpts.GetURI()))
	defaultDatabases[opts.Alias] = cs.Database
	ctx, cancel := context.WithTimeout(context.Background(), *e_utils.Coalesce(clientOpts.ConnectTimeout, lo.ToPtr(connectionTimeout)))
	defer cancel()
	client := lo.Must(mongo.Connect(ctx, clientOpts))
	e_utils.Must(client.Ping(ctx, readpref.Primary()))
	clients[opts.Alias] = *client
	return *client
}

// Simplest form of connect with just a URI and no options
func ConnectURI(uri string) mongo.Client {
	return Connect(ConnectionOptions{URI: uri})
}

// Get the database connection for a given alias or the default connection if no alias is provided
//
// @param alias - The alias of the connection to get
func GetConnection(alias ...string) mongo.Client {
	return clients[e_utils.Coalesce(e_utils.First(alias), "default")]
}

// Disconnect a set of connections by alias or disconnect all connections if no alias is provided
//
// @param aliases - The aliases of the connections to disconnect
func Disconnect(aliases ...string) error {
	if len(aliases) == 0 {
		aliases = maps.Keys(clients)
	}
	for _, alias := range aliases {
		err := lo.ToPtr(clients[alias]).Disconnect(context.Background())
		if err != nil {
			return err
		}
		delete(clients, alias)
		delete(defaultDatabases, alias)
	}
	return nil
}

// Use a specific database on a connection
//
// @param database - The name of the database to use
//
// @param alias - The alias of the connection to use
func Use(database string, alias ...string) *mongo.Database {
	return lo.ToPtr(clients[e_utils.Coalesce(e_utils.First(alias), "default")]).Database(e_utils.Coalesce(database, defaultDatabases[e_utils.Coalesce(e_utils.First(alias), "default")]))
}

// Use the default database on a connection. Uses the default connection if no alias is provided
//
// @param alias - The alias of the connection to use
func UseDefault(alias ...string) *mongo.Database {
	return lo.ToPtr(clients[e_utils.Coalesce(e_utils.First(alias), "default")]).Database(e_utils.Coalesce(defaultDatabases[e_utils.Coalesce(e_utils.First(alias), "default")], "test"))
}
