const User = require('../models/user');
const Review = require('../models/review');


module.exports.assignReview = async (req, res) => {
  const { recipient_email } = req.body;
  try {
    if (req.isAuthenticated()) {
      const reviewer = await User.findById(req.params.id);
      const recipient = await User.findOne({ email: recipient_email });

      
      const alreadyAssigned = reviewer.assignedReviews.filter(
        (userId) => userId == recipient.id
      );

      
      if (alreadyAssigned.length > 0) {
        req.flash('error', `Review already assigned!`);
        return res.redirect('back');
      }

      
      await reviewer.updateOne({
        $push: { assignedReviews: recipient },
      });

      req.flash('success', `review assigned successfully!`);
      return res.redirect('back');
    } else {
      req.flash('error', `couldn't assign the review`);
    }
  } catch (err) {
    console.log('error: ', err);
  }
};


module.exports.submitReview = async (req, res) => {
  const { recipient_email, feedback } = req.body;
  try {
    const recipient = await User.findOne({ email: recipient_email });
    const reviewer = await User.findById(req.params.id);

    
    const review = await Review.create({
      review: feedback,
      reviewer,
      recipient,
    });

    
    const reviewString = review.review.trim();

    
    if (reviewString === '') {
      req.flash('error', `Feedback section can't be empty!`);
      return res.redirect('back');
    }

    
    await recipient.updateOne({
      $push: { reviewsFromOthers: review },
    });

    
    await reviewer.updateOne({
      $pull: { assignedReviews: recipient.id },
    });

    req.flash('success', `review submitted successfully!`);
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
  }
};


module.exports.updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const reviewToBeUpdated = await Review.findById(req.params.id);

    
    if (!reviewToBeUpdated) {
      req.flash('error', 'Review does not exist!');
    }

    reviewToBeUpdated.review = feedback; 
    reviewToBeUpdated.save(); 
    req.flash('success', 'Review updated !');
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};