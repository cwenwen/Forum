const sequelize = require('../model/db');
const Comment = require('../model/comment');
const User = require('../model/user');

module.exports = {
  
  insertComment: (req, res) => {
    Comment
    .create({
      username: req.session.username,
      topic: req.body.topic,
      content: req.body.content,
      parentId: req.body.parentId
    })
    .then((comment) => {
      const commentId = comment.dataValues.id;
      Comment
        .findAll({
          where: {
            id: commentId
          }
        })
        .then(data => {
          const createdAt = data[0].dataValues.createdAt
          res.send('ok');
        })
        .catch(error => {throw error})
    })
    .catch(error => {throw error})
  },
  
  showComments: (req, res) => {
    let totalPages,
        currentPage,
        commentStartNumber;

    // check if user has logged in
    if (req.session.username) {
      res.locals.user = { 
        username: req.session.username,
        nickname: req.session.nickname
      };
    } else {
      res.locals.user = {
        username: undefined,
        nickname: undefined
      };
    }
    
    // get the number of main comments
    Comment
      .findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('parentId')), 'datanum']],
        where: {
          parentId: 0
        }
      })
      .then(data => {
        // calculate the number of pages
        if (data[0].dataValues.datanum === 0) {
          totalPages = 1;
        } else {
          totalPages = Math.ceil(data[0].dataValues.datanum / 10); 
        }
        res.locals.totalPages = totalPages;

        // handle invalid page number
        if (parseInt(req.params.page) < 0 || parseInt(req.params.page) > totalPages || isNaN(parseInt(req.params.page))) {
          res.redirect('/pages/1');

        } else {
          // set current page
          currentPage = parseInt(req.params.page);
          res.locals.currentPage = currentPage;

          // find the first comment of each page
          commentStartNumber = ( currentPage - 1 ) * 10;
        }

        // associations
        User.hasMany(Comment, {foreignKey: 'username'});
        Comment.belongsTo(User, {foreignKey: 'username'});

        // get 10 comments for current page
        sequelize
          .query('SELECT `comment`.`id` AS `commentId` , `comment`.`username` AS `username` , `comment`.`parentId` AS `parentId` , `comment`.`topic` AS `topic` , `comment`.`content` AS `content` , `comment`.`createdAt` AS `createdAt` , `user`.`nickname` AS `nickname` FROM `cwenwen_comments` AS `comment` INNER JOIN `cwenwen_users` AS `user` ON `comment`.`username` = `user`.`username` WHERE `comment`.`parentId` = 0 ORDER BY `comment`.`createdAt` DESC LIMIT ' + commentStartNumber + ', 10;', { type: sequelize.QueryTypes.SELECT })
          .then(comments => {
            res.locals.comments = comments;

            // get subcomments
            let promises = [];
            for (let i = 0; i < res.locals.comments.length; i++) {
              promises.push(
                sequelize
                  .query('SELECT `comment`.`id` AS `commentId` , `comment`.`username` AS `username` , `comment`.`parentId` AS `parentId` , `comment`.`content` AS `content` , `comment`.`createdAt` AS `createdAt` , `user`.`nickname` AS `nickname` FROM `cwenwen_comments` AS `comment` INNER JOIN `cwenwen_users` AS `user` ON `comment`.`username` = `user`.`username` WHERE `comment`.`parentId` = ' + res.locals.comments[i].commentId + ' ORDER BY `comment`.`createdAt` ASC;', { type: sequelize.QueryTypes.SELECT })
                  .then(subcomments => {
                    res.locals.comments[i].subComments = subcomments;
                  })
                  .catch(error => {throw error})
              )
            }
            // after getting all subcomments
            Promise.all(promises).then(() => {
              const nickname = req.session.nickname;
              res.render('index', {nickname});
            });
          })
          .catch(error => {throw error})

      })
      .catch(error => { throw error })
  },

  modifyComment: (req, res) => {
    Comment
      .update({
        content: req.body.content,
      }, {
        where: {
          id: req.body.commentId
        }
      })
      .then(() => res.send('modified'))
      .catch(error => {throw error})
  },

  deleteComment: (req, res) => {
    Comment
      .destroy({
        where: {
          id: req.body.commentId
        }
      })
      .then(() => {
        return Comment.destroy({
          where: {
            parentId: req.body.commentId
          }
        })
      })
      .then(() => res.send('deleted'))
      .catch(error => {throw error})
  }
}