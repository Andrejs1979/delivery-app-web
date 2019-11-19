const Consumer = require("../db/models/Consumer");
const clearbit = require("./clearbit");

module.exports = async (email, merchant) => {
  let consumer;
  const _merchant = merchant._id;
  consumer = await Consumer.findOne({ email });

  if (!consumer || consumer === "null") {
    consumer = await Consumer.create({
      email
    });

    try {
      await clearbit.enrich(email);
    } catch (e) {
      console.log(e);
    }
  }

  // Add Merchant permission
  return await Consumer.findByIdAndUpdate(
    consumer,
    {
      $push: { merchants: { _merchant } }
    },
    { new: true }
  );
};
