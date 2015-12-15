// Products
  // Security
    // - [Merchant] can [insert, update]
    // - [Admin] can [insert, update]
    // - [Rep] can [insert, update]

Tinytest.addAsync('Products - Security - [Merchant] can [insert, update]', function(test, done) {
  var storefrontId, productId

  testLogout(test, begin)

  function begin() {
    testLogin([Mart.ROLES.GLOBAL.MERCHANT], test, onLogin)
  }

  function onLogin() {
    Mart.Storefronts.insert({
      name: "testtest",
      description: "asasdfsadf dasfasdd",
      isPublished: true,
    }, onStorefrontInserted)
  }

  function onStorefrontInserted(error, response) {
    storefrontId = response
    Mart.Products.insert({
      storefrontId: storefrontId,
      name: "asd;skdf sdf",
      description: "a;sldfjkas;dlf",
      unitPrice: 4523,
      isPublished: false
    }, onProductInserted)
  }

  var sub1
  function onProductInserted(error, response) {
    productId = response
    test.isUndefined(error)
    sub1 = Meteor.subscribe('mart/storefront', storefrontId, function() {
      var product = Mart.Products.findOne(productId)
      test.equal(product.storefrontId, storefrontId)
      test.equal(product.name, "asd;skdf sdf")
      test.equal(product.description, "a;sldfjkas;dlf")
      test.equal(product.unitPrice, 4523),
      test.isFalse(product.isPublished)
      test.isFalse(product.isDeleted)

      Mart.Products.update(productId, {$set: {name: "hotness"}}, onUpdate)
    })
  }

  var sub2
  function onUpdate(error, response) {
    sub2 = Meteor.subscribe('mart/storefront', storefrontId, function() {
      var product = Mart.Products.findOne(productId)
      test.equal(product.name, "hotness")

      Mart.Products.remove(productId, function(error, response) {
        test.isNotUndefined(error) // should not be allowed to delete

        sub1.stop()
        sub2.stop()
        done()
      })
    })
  }
})

_.each([Mart.ROLES.GLOBAL.REP, Mart.ROLES.GLOBAL.ADMIN], function(role) {
Tinytest.addAsync('Products - Security - [' + role + '] can [insert, update]', function(test, done) {
  var storefrontId, productId

  testLogout(test, begin)

  function begin() {
    testLogin([role], test, onLogin)
  }

  function onLogin() {
    Mart.Storefronts.insert({
      name: "testtest",
      description: "asasdfsadf dasfasdd",
      isPublished: true,
      userId: "fakeId"
    }, onStorefrontInserted)
  }

  function onStorefrontInserted(error, response) {
    test.isUndefined(error)
    storefrontId = response
    Mart.Products.insert({
      storefrontId: storefrontId,
      name: "asd;skdf sdf",
      description: "a;sldfjkas;dlf",
      unitPrice: 4523,
      isPublished: false
    }, onProductInserted)
  }

  var sub1
  function onProductInserted(error, response) {
    productId = response
    test.isUndefined(error)
    sub1 = Meteor.subscribe('mart/storefront', storefrontId, function() {
      var product = Mart.Products.findOne(productId)
      test.equal(product.storefrontId, storefrontId)
      test.equal(product.name, "asd;skdf sdf")
      test.equal(product.description, "a;sldfjkas;dlf")
      test.equal(product.unitPrice, 4523),
      test.isFalse(product.isPublished)
      test.isFalse(product.isDeleted)

      Mart.Products.update(productId, {$set: {name: "hotness"}}, onUpdate)
    })
  }

  var sub2
  function onUpdate(error, response) {
    sub2 = Meteor.subscribe('mart/storefront', storefrontId, function() {
      var product = Mart.Products.findOne(productId)
      test.equal(product.name, "hotness")

      sub1.stop()
      sub2.stop()
      done()
    })
  }
})
})
