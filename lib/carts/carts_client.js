_.extend(Mart.Cart, {
  checkoutDetailsSchema: new SimpleSchema({
    cardId: {
      type: String,
      optional: true
    },
    contactName: {
      type: String,
      optional: true
    },
    contactEmail: {
      type: String,
      optional: true
    },
    contactPhone: {
      type: String,
      optional: true
    },
    contactEntity: {
      type: String,
      optional: true
    },
  }),
  currentCart: function() {
    var cart = {state: Mart.Cart.STATES.SHOPPING},
        userId = Meteor.userId()

    if(userId) {
      _.extend(cart, {userId: userId})
    } else {
      _.extend(cart, {guestId: Mart.guestId()})
    }
    return Mart.Carts.findOne(cart)
  },
  currentCartId: function() {
    if(this.currentCart())
      return this.currentCart()._id

    return undefined
  },
})

// Handlebars.registerHelper("cart", function() {
//   return Mart.Cart.currentCart()
// });

// Handlebars.registerHelper("lineItems", function() {
//   if(Mart.Cart.currentCartId())
//     return Mart.Cart.lineItems(Mart.Cart.currentCartId());
//   return []
// });
//
// Handlebars.registerHelper("cartId", function() {
//   return Mart.Cart.currentCartId()
// });
//
// Handlebars.registerHelper("cartSubtotal", function() {
//   if(Mart.Cart.currentCartId())
//     return Mart.Cart.subtotal(Mart.Cart.currentCartId())
//   return 0
// });
//
Handlebars.registerHelper("cartSize", function() {
  var carts = Mart.Carts.find({userId: Meteor.userId(), state: Mart.Cart.STATES.SHOPPING}).fetch()

  return _.reduce(carts, function(sum, cart) {
    return sum + cart.lineItems().length
  }, 0)
});

Handlebars.registerHelper("cartHasItems", function() {
  var carts = Mart.Carts.find({userId: Meteor.userId(), state: Mart.Cart.STATES.SHOPPING}).fetch()

  return !!_.find(carts, function(cart) {
    return cart.lineItems().length > 0
  })
});
