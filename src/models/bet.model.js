const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const betSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    gameId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    betType: {
      type: String,
      trim: true,
      required: true
    },
    memberCount: {
      type: Number,
      default: 0
    },
    inPot: {
      type: mongoose.Decimal128,
      default: 0
    },
    correctAnswerIds: {
      type: [Number]
    },
    correctAnswerDecimal: {
      type: mongoose.Decimal128,
    },
    isAborted: {
      type: Boolean,
      default: false
    },
    isSolved: {
      type: Boolean,
      default: false
    },
    solvedAt: {
      type: Date
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    dynamicOdds: {
      type: Boolean,
      default: false
    },
    dynamicOddsPower: {
      type: mongoose.Decimal128,
    },
    catalogue_answers: {
      type: [{
        title: {
          type: String,
          required: true
        },
        baseOdds: {
          type: mongoose.Decimal128,
          required: true
        },
        currentOdds: {
          type: mongoose.Decimal128,
          required: true
        },
        inPot: {
          type: mongoose.Decimal128,
          default: 0,
          required: true
        },
        memberCount: {
          type: Number,
          default: 0,
          required: true
        },
      }]
    },
    scale_options: {
      type: {
        step: {
          type: Number,
          required: true
        },
        min: {
          type: Number,
          required: true
        },
        max: {
          type: Number,
          required: true
        },
        winRate: {
          type: Number,
          required: true
        },
      }
    },
    scale_answers: {
      type: [{
        from: {
          type: mongoose.Decimal128,
          required: true
        },
        inPot: {
          type: mongoose.Decimal128,
          default: 0,
          required: true
        },
        memberCount: {
          type: Number,
          default: 0,
          required: true
        },
        baseOdds: {
          type: mongoose.Decimal128,
          required: true
        },
        currentOdds: {
          type: mongoose.Decimal128,
          required: true
        },
      }]
    },
    timeLimit: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' },
  }
);

// add plugin that converts mongoose to json
betSchema.plugin(toJSON);
betSchema.plugin(paginate);


/**
 * @typedef Bet
 */
const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;
