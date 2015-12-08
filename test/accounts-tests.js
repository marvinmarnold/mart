  // anybody not logged in can create a shopper or merchant
_.each([
  Mart.ROLES.GLOBAL.SHOPPER,
  Mart.ROLES.GLOBAL.MERCHANT
], function(role) {
  var shopper = {
    profile: {roles: [role]},
    email: Random.id() + "@" + Random.id() + ".com",
    password: 'swefsadfasdfsad',
  }

  Tinytest.addAsync('Accounts - Create ' + role + " not logged in", function(test, done) {
    testLogout(test, createUser)
    function createUser() {
      Accounts.createUser(shopper, function(error) {
        test.isUndefined(error)
        test.isNotUndefined(Meteor.userId())
        Accounts.createUser(shopper, function(error) {
          test.isNotUndefined(error);
          done()
        })
      })
    }
  })
})

// nobody can create admins or reps if not logged in
_.each([
  Mart.ROLES.GLOBAL.ADMIN,
  Mart.ROLES.GLOBAL.REP
], function(role) {
  var shopper = {
    profile: {roles: [role]},
    email: Random.id() + "@" + Random.id() + ".com",
    password: 'swefsadfasdfsad',
  }

  Tinytest.addAsync('Accounts - Create ' + role + " not logged in", function(test, done) {
    testLogout(test, createUser)
    function createUser() {
      Accounts.createUser(shopper, function(error) {
        test.isNotUndefined(error)
        done()
      })
    }
  })
})
