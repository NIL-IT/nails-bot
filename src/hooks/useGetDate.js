const month = {
  "01": "Январь",
  "02": "Февраль",
  "03": "Март",
  "04": "Апрель",
  "05": "Май",
  "06": "Июнь",
  "07": "Июль",
  "08": "Август",
  "09": "Сентябрь",
  10: "Октябрь",
  11: "Ноябрь",
  12: "Декабрь",
};
export const useGetDate = (date) => {
  const dateArr = date.split(".").slice(1, 3);
  const getMonth = month[dateArr[0]];
  const year = `20${dateArr[1]}`;
  return {
    getMonth,
    year,
  };
};
console.log();
