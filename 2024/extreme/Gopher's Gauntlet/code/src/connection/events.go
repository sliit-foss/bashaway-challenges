package e_connection

import "go.mongodb.org/mongo-driver/event"

var eventListeners = make(map[string]map[string]func())

func triggerEventIfRegistered(alias, eventType string) {
	if eventListeners[alias][eventType] != nil {
		eventListeners[alias][eventType]()
	}
}

func poolMonitor(alias string) *event.PoolMonitor {
	poolMonitor := &event.PoolMonitor{
		Event: func(evt *event.PoolEvent) {
			if eventListeners[alias] != nil {
				switch evt.Type {
				case event.ConnectionClosed:
					triggerEventIfRegistered(alias, event.ConnectionClosed)
				case event.ConnectionCreated:
					triggerEventIfRegistered(alias, event.ConnectionCreated)
				case event.ConnectionReady:
					triggerEventIfRegistered(alias, event.ConnectionReady)
				case event.ConnectionReturned:
					triggerEventIfRegistered(alias, event.ConnectionReturned)
				case event.GetFailed:
					triggerEventIfRegistered(alias, event.GetFailed)
				case event.GetStarted:
					triggerEventIfRegistered(alias, event.GetStarted)
				case event.GetSucceeded:
					triggerEventIfRegistered(alias, event.GetSucceeded)
				case event.PoolCleared:
					triggerEventIfRegistered(alias, event.PoolCleared)
				case event.PoolClosedEvent:
					triggerEventIfRegistered(alias, event.PoolClosedEvent)
				case event.PoolCreated:
					triggerEventIfRegistered(alias, event.PoolCreated)
				case event.PoolReady:
					triggerEventIfRegistered(alias, event.PoolReady)
				}
			}
		},
	}
	return poolMonitor
}

// Add a listener to a connection
//
// @param event - The event to listen for
//
// @param handler - The function to call when the event is triggered
//
// @param alias - The alias of the connection to listen to
func On(event string, handler func(), alias ...string) {
	if len(alias) == 0 {
		alias = []string{"default"}
	}
	if eventListeners[alias[0]] == nil {
		eventListeners[alias[0]] = make(map[string]func())
	}
	eventListeners[alias[0]][event] = handler
}
