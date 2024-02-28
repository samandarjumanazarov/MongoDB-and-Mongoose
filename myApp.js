const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let Person;

const personSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  age : {
    type: Number
  },
  favoriteFoods : {
    type: [String]
  }
})
Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({name: "Hum Doyi", age: 25, favoriteFoods: ["Manti", "Sushi", "Somsa"]});

  person.save((err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if(err) return done(err);
    return done(null, people);
  });
  
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, person) => {
    if(err) return done(err);
    return done(null, person);
  })
 
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, foundFood) => {
    if(err) {
      return done(err);
    } 
    return done(null, foundFood);
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, (err, person) => {
    if(err) {
      return done(err)
    }
    return done(null, person);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id: personId}, (err, foundPerson) => {
    if(err) {
      return done(err)
    }

    foundPerson.favoriteFoods.push(foodToAdd);

    foundPerson.save((err, person) => {
      if(err) {
        return done(err)
      }
      done(null, person);
    })
    
  }) 
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName},  { $set: { age: ageToSet } },  {new: true}, (err, person) => {
    if(err) {
      return done(err)
    }
    person.age = ageToSet;

    done(null, person);
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id: personId}, (err, person) => {
    if(err) {
      return done(err)
    }
    done(null, person);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.deleteMany({name: nameToRemove}, (err, person) => {
    if(err) {
      return done(err)
    }
    done(null, person);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}).sort("name").limit(2).select({age: 0}).exec((err, persons) => {
    if(err) {
      return done(err)
    }
    done(null, persons)
  })  
};

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
