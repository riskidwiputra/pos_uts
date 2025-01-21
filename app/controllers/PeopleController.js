
const Users         = require("../models").Users;
const Roles         = require("../models").Roles;


class PeopleController {
    static async listUsers(req, res) {
      try {
        const refreshToken = req.cookies.refresh_token;
        const user = await Users.findOne({ where: { refresh_token: refreshToken },
            include: [
                {
                    model: Roles,
                    attributes:['role_name']
                },
            ]
         });
         if (user.role_id == 2) { // If user is kasir
          res.redirect(`${process.env.BASE_URL}/admin/list-product`);
         }
         const users = await Users.findAll({
            include: [
                {
                    model: Roles,
                    attributes:['role_name']
                },
            ]
         });
        
  
        const data = {
          users
        };
  
        res.render('admin/people/users', {
          layout: "admin/layouts/",
          title: "Dashboard",
          user,
          data,
          menu : "people",
          baseUrl: process.env.BASEURL
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  module.exports = PeopleController;
