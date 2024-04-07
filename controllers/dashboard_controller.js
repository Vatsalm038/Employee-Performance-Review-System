const Review = require('../models/review');
const User = require('../models/user');


module.exports.adminDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        
        let users = await User.find({}).populate('username');

        
        let filteredUsers = users.filter(
          (user) => user.email !== req.user.email
        );

        return res.render('admin_dashboard', {
          title: 'Admin dashboard',
          users: filteredUsers,
        });
      } else {
        return res.redirect('back');
      }
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }
};


module.exports.employeeDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      
      const employee = await User.findById(req.params.id)
        .populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        })
        .populate('assignedReviews');

      
      const assignedReviews = employee.assignedReviews;

      
      const reviewsFromOthers = employee.reviewsFromOthers;

      
      const populatedResult = await Review.find().populate({
        path: 'reviewer',
        model: 'User',
      });

      return res.render('employee_dashboard', {
        title: 'Employee dashboard',
        employee,
        assignedReviews,
        reviewsFromOthers,
      });
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('back');
  }
};
