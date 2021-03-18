var fs = require('fs');
var chado = require('chado');
var createDouble = chado.createDouble;
var assume = chado.assume; // with assume you describe your assumption
var verify = chado.verify; // with verify you can check your assumptions against a real object

describe('pizza restaurant', function(){
  describe('a customer', function () {
    it('can successfully order a pizza tonno', function customer() {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza tonno').andReturns('pizza tonno'); // will never be called here
    });
  });

  describe('the waiter', function () {
    it('passes the translated order to the chef', function () {
      var chef = createDouble('chef');
      var waiter = createWaiter(chef);
      assume(chef).canHandle('make').withArgs('143').andReturns('pizza tonno');

      verify('waiter').canHandle('order').withArgs('pizza tonno').andReturns('pizza tonno').on(waiter);
    });
  });

  describe('the chef', function () {
    it('can make pizzas, if the pantry has everything needed to produce an order', function () {
      var pantry = createPantry({
        dough: ['dough'],
        cheese: ['cheese'],
        'tomato sauce': ['tomato sauce'],
        tuna: ['tuna']
      });
      var chef = createChef(pantry);

      verify('chef').canHandle('make').withArgs('143').andReturns('pizza tonno').on(chef);
    });
  });

  afterAll(function () {
    chado.consoleReporter.logReport();
    // fs.writeFileSync(
    //   "chado-result.json", 
    //   JSON.stringify(chado.repo, null, 2)
    // );
  });
});

function createWaiter(chef) {
  var internalmenu = {'pizza tonno': '143'};

  function order(meal) {
    try {
      return chef.make(internalmenu[meal]);
    }
    catch (e) {
      throw new Error('Sorry. Maybe you want to order something else?');
    }
  }

  return {
    order: order
  };
}

function createChef(pantry) {
  var recipes = {'143': ['dough', 'cheese', 'tomato sauce', 'tuna']};
  var externalmenu = {'143': 'pizza tonno'};

  function make(order) {
    var ingredients = recipes[order];
    if (!pantry.has(ingredients)) {
      throw new Error('Not available');
    }
    ingredients.forEach(function (ingredient) {
      pantry.take(ingredient);
    }, this);

    return externalmenu[order];
  }

  return {
    make: make
  };
}

function createPantry(repos) {

  function has(ingredients) {
    return ingredients.every(ingredient => {
      return !!repos[ingredient]
    })
  }

  function take(ingredient) {
    console.info(` // cook with ${ingredient}... `)
  }

  return {
    has,
    take
  }
}
