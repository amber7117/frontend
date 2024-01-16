import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Users from "models/Users";
import Products from "models/Products";

import Cors from "cors";
import { isValidToken } from "src/utils/jwt";

const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(req: any, res: any) {
  await runMiddleware(req, res, cors);

  const {
    method,
    headers: { authorization },
  } = req;

  const isValid = isValidToken(authorization);

  // Check token validity
  !isValid &&
    res
      .status(400)
      .json({ success: false, data: null, message: "Invalid token" });

  await dbConnect();
  // Utility function to get the number of days in a given month and year
  function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  // Utility function to get the date of the previous week
  function getLastWeeksDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  }

  // Utility function to get the orders report by month
  function getOrdersReport(ordersByYears: any): number[] {
    const getDays = ordersByYears?.map(
      (v: any) => new Date(v.createdAt).getMonth() + 1
    );

    const getData = [...new Array(12)].map(
      (day, i) => getDays?.filter((v: any) => v === 1 + i).length
    );

    return getData;
  }

  // Utility function to get the income report based on the provided time period (week, month, or year)
  function getIncomeReport(
    prop: "week" | "month" | "year",
    ordersByYears: any
  ): number[] {
    const newData = ordersByYears.filter((item: any) => {
      return prop === "year"
        ? item
        : prop === "week"
        ? new Date(item.createdAt).getMonth() === new Date().getMonth() &&
          new Date(item.createdAt).getTime() > getLastWeeksDate().getTime()
        : new Date(item.createdAt).getMonth() === new Date().getMonth();
    });

    const getData = [
      ...new Array(
        prop === "week"
          ? 7
          : prop === "year"
          ? 12
          : getDaysInMonth(new Date().getMonth() + 1, new Date().getFullYear())
      ),
    ].map((day, i) =>
      prop === "week"
        ? newData
            ?.filter(
              (v: any) =>
                new Date(v.createdAt).getDate() ===
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  getLastWeeksDate().getDate() + 1 + i
                ).getDate()
            )
            .reduce(
              (partialSum: any, a: any) => partialSum + Number(a.basePrice),
              0
            )
        : prop === "year"
        ? newData
            ?.filter((v: any) => new Date(v.createdAt).getMonth() === i)
            .reduce(
              (partialSum: any, a: any) => partialSum + Number(a.basePrice),
              0
            )
        : newData
            ?.filter((v: any) => new Date(v.createdAt).getDate() === i + 1)
            .reduce(
              (partialSum: any, a: any) => partialSum + Number(a.basePrice),
              0
            )
    );

    return getData;
  }

  switch (method) {
    case "GET":
      try {
        // Fetch all users created today
        const users = await Users.find({
          // createdAt: { $gte: startOfToday },
        }).select("createdAt");

        // Count the total number of products
        const totalProducts = await Products.countDocuments({});

        const lastYearDate = new Date(
          `${new Date().getFullYear() - 1}-12-31`
        ).getTime();
        const todayDate = new Date().getTime();

        // Fetch orders created in the last year
        const ordersByYears = await Orders.find({
          createdAt: { $gt: lastYearDate, $lt: todayDate },
        }).select(["createdAt", "status", "basePrice"]);

        // Fetch orders created today
        const todaysOrders = ordersByYears.filter(
          (v) =>
            new Date(v.createdAt).toLocaleDateString() ===
            new Date().toLocaleDateString()
        );

        const data = {
          salesReport: getOrdersReport(ordersByYears),
          ordersReport: [
            ordersByYears.filter((v) => v.status === "pending").length,
            ordersByYears.filter((v) => v.status === "ontheway").length,
            ordersByYears.filter((v) => v.status === "delivered").length,
            ordersByYears.filter((v) => v.status === "returned").length,
            ordersByYears.filter((v) => v.status === "cancelled").length,
          ],
          incomeReport: {
            week: getIncomeReport("week", ordersByYears),
            month: getIncomeReport("month", ordersByYears),
            year: getIncomeReport("year", ordersByYears),
          },
          dailyUsers: users.length,
          totalProducts: totalProducts,
          dailyOrders: todaysOrders.length,
          dailyEarning: todaysOrders.reduce(
            (partialSum, a) => partialSum + a.basePrice,
            0
          ),
        };

        /* find all the data in our database */
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
  }
}
