Tinytest.addAsync("Images - Storefronts - Can add images with merchant", function(test, done) {
  var storefrontId, storefrontSub

  testLogout(test, createMerchant)

  function createMerchant() {
    testLogin([Mart.ROLES.GLOBAL.MERCHANT], test, function(error, email) {
      createStorefronts()
    })
  }

  // one storefront per merchant
  function createStorefronts() {
    Mart.Storefronts.insert({
      name: "testtest",
      description: "asasdfsadf dasfasdd",
      isPublished: true,
      isDeleted: false,
      address: 'asdfasdf',
      city: 'asdfsadf',
      state: 'asdfsad',
      zip: 'adfsa'
    }, function(error, id) {
      testError(error, test, "Could not create storefront for merchant")
      storefrontId = id

      storefrontSub = Meteor.subscribe('mart/storefront', storefrontId, function() {
        addImage()
      })
    })
  }

  function addImage() {
    Mart.Images.insert({
      objectId: storefrontId,
      objectCollection: "Storefronts",
      index: 1,
      originalUrl: "123",
      optimizedUrl: "456",
      thumbnailUrl: "789"
    }, function(error, id) {
      testError(error, test, "Could not add image to storefront")

      Mart.Images.update(id, {$set: {
        originalUrl: "123",
        optimizedUrl: "456",
        thumbnailUrl: "789"
      }}, function(error, id) {
        testError(error, test, "Could not add image to storefront")
        test.equal(Mart.Images.find().count(), 1, "Wrong number of images returned")

        storefrontSub.stop()
        done()
      })
    })
  }
})
