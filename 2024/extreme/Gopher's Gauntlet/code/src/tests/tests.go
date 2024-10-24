package e_tests

import (
	"elemental/tests/base"
	. "github.com/smartystreets/goconvey/convey"
	"testing"
	"time"
)

type Castle = e_test_base.Castle

type Kingdom = e_test_base.Kingdom

type Monster = e_test_base.Monster

type Bestiary = e_test_base.Bestiary

type MonsterWeakness = e_test_base.MonsterWeakness

type User = e_test_base.User

var UserModel = e_test_base.UserModel

var MonsterModel = e_test_base.MonsterModel

var KingdomModel = e_test_base.KingdomModel

var BestiaryModel = e_test_base.BestiaryModel

func SoTimeout(t *testing.T, f func() bool, timeout ...<-chan time.Time) {
	if len(timeout) == 0 {
		timeout = append(timeout, time.After(10*time.Second))
	}
	for {
		select {
		case <-timeout[0]:
			t.Fatalf("Timeout waiting for assertion to execute")
		default:
			ok := f()
			if ok {
				So(ok, ShouldBeTrue)
				return
			} else {
				time.Sleep(100 * time.Millisecond)
			}
		}
	}
}
