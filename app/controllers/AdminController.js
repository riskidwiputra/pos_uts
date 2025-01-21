
const Users         = require("../models").Users;
const Roles         = require("../models").Roles;
const SaleService = require('../services/SaleService');

class AdminController {
    static async admin(req, res) {
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
        const salesSummary = await SaleService.getSalesSummary('month');
        const data = {
          data: "data"
        };
  
        res.render('admin/', {
          layout: "admin/layouts/",
          title: "Dashboard",
          user,
          data,
          salesSummary,
          menu : "dashboard",
          baseUrl: process.env.BASEURL,
          formatCurrency: (amount) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(amount);
        }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  module.exports = AdminController;
