const Consumer = require('../db/models/Consumer');

module.exports = async (consumer, cardProps) => {
  const { bin, last4 } = cardProps;

  if (consumer) {
    const card = consumer.cards
      .filter(card => card.bin === bin && card.last4 === last4)
      .pop();

    if (card) {
      return card;
    } else {
      const { cards } = await Consumer.findByIdAndUpdate(
        consumer,
        {
          $push: { cards: cardProps }
        },
        { new: true }
      );

      return cards
        .filter(card => card.bin === bin && card.last4 === last4)
        .pop();
    }
  }
};
