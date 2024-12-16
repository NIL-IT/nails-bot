export const USERS = [
  {
    id: 1,
    isAdmin: true,
    name: "Петрова Елена",
    orders: [
      {
        id: 1,
        date: "10.10.24",
        time: "17:00 (GTM+7)",
        number: "0798877",
        items: [
          {
            id: 1,
            quantity: 2,
          },
          {
            id: 2,
            quantity: 2,
          },
          {
            id: 3,
            quantity: 3,
          },
        ],
      },
      {
        id: 2,
        date: "05.09.24",
        time: "14:00 (GTM+7)",
        items: [
          {
            id: 4,
            quantity: 2,
          },
          {
            id: 2,
            quantity: 2,
          },
          {
            id: 3,
            quantity: 2,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    isAdmin: false,
    name: "Петрова Елена",
    orders: [
      {
        id: 1,
        date: "10.10.24",
        time: "17:00 (GTM+7)",
        number: "0798877",
        items: [
          {
            id: 1,
            quantity: 2,
          },
          {
            id: 2,
            quantity: 4,
          },
          {
            id: 3,
            quantity: 2,
          },
        ],
      },
      {
        id: 2,
        date: "05.09.24",
        time: "14:00 (GTM+7)",
        items: [
          {
            id: 4,
            quantity: 2,
          },
          {
            id: 2,
            quantity: 2,
          },
          {
            id: 3,
            quantity: 2,
          },
        ],
      },
    ],
  },
];

export const CATEGORIES = [
  {
    id: 1,
    name: "Базы",
  },
  {
    id: 2,
    name: "Скидки",
  },
  {
    id: 3,
    name: "Дизайны",
  },
  {
    id: 4,
    name: "Покрытия",
  },
  {
    id: 5,
    name: "Инструменты",
  },
];
export const PRODUCTS = [
  {
    id: 1,
    title: "Базы Foxy Expert",

    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 1,
      name: "Базы",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 2,
    title: "Базы AdriCoco",

    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 1,
      name: "Базы",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 3,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 2,
      name: "Скидки",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 4,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 2,
      name: "Скидки",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 5,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 3,
      name: "Дизайны",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 6,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 3,
      name: "Дизайны",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 7,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 4,
      name: "Покрытия",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
  {
    id: 8,
    title: "Базы Foxy Expert",
    subtitle: "Lax (Лакс)",
    img: "../../public/img/item.png",
    price: 350,
    category: {
      id: 4,
      name: "Покрытия",
    },
    desc: "каучуковая MILKY",
    volume: "10 мл #2",
    article: 9920,
    descriptions: [
      "Жидкий молочный полигель от ТМ LAX",
      "Жидкой гель-базой можно выравнивать, ремонтировать и донаращивать свободный край ногтевой пластины.",
      "Для подвижных и тонких ногтей необходима подложка из базы с высокой адгезией",
      "Средняя пигментация, хорошо перекрывает НП",
    ],
  },
];
