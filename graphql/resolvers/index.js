const bcrypt = require('bcryptjs');

const Bounty = require('../../models/Bounty');
const User = require('../../models/User');

const bounties = bountyIds => {
  return Bounty.find({_id: {$in: bountyIds}})
    .then(bounties => {
      return bounties.map(bounty => {
        return { 
          ...bounty._doc,
          creator: user.bind(this, bounty.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return { 
        ...user._doc,
        createdBounties: bounties.bind(this, user._doc.createdBounties)
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  bounties: () => {
    return Bounty.find().populate('creator')
      .then(bounties => {
        return bounties.map(bounty => {
          return { 
            ...bounty._doc,
            creator: user.bind(this, bounty._doc.creator) 
          };
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createBounty: (args) => {
    const bounty = new Bounty({
      price: +args.bountyInput.price,
      class: args.bountyInput.class,
      description: args.bountyInput.description,
      creator: '5c8301ee10e7af2c782f648e'
    });
    let createdBounty;
    return bounty.save()
      .then(result => {
        createdBounty = { 
          ...result._doc,
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById('5c8301ee10e7af2c782f648e')
      })
      .then(creator => {
        if (!creator){
          throw new Error('User not found.');
        }
        creator.createdBounties.push(bounty);
        return creator.save();
      })
      .then(result => {
        return createdBounty;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: (args) => {
    // Check if email already exists in db
    return User.findOne({ email: args.userInput.email })
      .then(creator => {
        if (creator) {
          throw new Error('Email already exists.');
        }
        return bcrypt.hash(args.userInput.password, 12)
      })
      // Hash password
      .then(hashedPass => {
        const creator = new User({
          name: args.userInput.name,
          email: args.userInput.email,
          password: hashedPass
        });
        // Save into db, return null password for security
        return creator.save()
          .then(result => {
            console.log(result);
            return { ...result._doc, password: null };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}