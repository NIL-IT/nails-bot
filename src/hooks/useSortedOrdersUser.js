export const useSortedOrdersUser = (object) => {
  const sortedOrders = object.orders.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split(".");
    const [dayB, monthB, yearB] = b.date.split(".");
    const [timeA] = a.time.split(" ");
    const [timeB] = b.time.split(" ");
    const dateTimeA = new Date(
      `20${yearA}`,
      monthA - 1,
      dayA,
      ...timeA.split(":")
    );
    const dateTimeB = new Date(
      `20${yearB}`,
      monthB - 1,
      dayB,
      ...timeB.split(":")
    );

    return dateTimeB.getTime() - dateTimeA.getTime();
  });
  return sortedOrders;
};
