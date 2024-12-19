import React from "react";

export const useSortedOrders = (data) => {
  const sortedOrders = React.useMemo(() => {
    return data
      .flatMap((user) =>
        user.orders.map((order) => ({
          ...order,
          userName: user.name,
          isAdmin: user.isAdmin,
          userId: user.id,
        }))
      )
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split(".");
        const [dayB, monthB, yearB] = b.date.split(".");
        const dateA = new Date(`20${yearA}`, monthA - 1, dayA);
        const dateB = new Date(`20${yearB}`, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      });
  }, []);
  const groupedOrders = sortedOrders.reduce((acc, order) => {
    const [day, month, year] = order.date.split(".");
    const key = `${month}.${year}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(order);
    return acc;
  }, {});
  const result = Object.entries(groupedOrders)
    .map(([key, orders]) => ({
      monthYear: key,
      orders: orders,
    }))
    .sort((a, b) => {
      const [monthA, yearA] = a.monthYear.split(".");
      const [monthB, yearB] = b.monthYear.split(".");

      // Compare years first
      if (yearA !== yearB) {
        return yearB.localeCompare(yearA);
      }
      // If years are same, compare months
      return monthB.localeCompare(monthA);
    });
  return result;
};
