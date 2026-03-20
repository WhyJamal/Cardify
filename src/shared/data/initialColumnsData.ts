import { ColumnInt } from "../types";

const MOBILE_IMG =
  "https://images.unsplash.com/photo-1759765299418-02dfc7a6ad75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const WORKFLOW_IMG =
  "https://images.unsplash.com/photo-1557200134-3103da7b6bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const APP_IMG =
  "https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

export const initialColumns: ColumnInt[] = [
  {
    id: "col-1",
    title: "На этой неделе",
    cards: [
      {
        id: "card-1",
        image: "/images/87855c9dd4548ab725ac600d9c082b8681ae99cc.webp",
        numberBadge: 1,
        links: [
          { icon: "✦", text: "New to Cardify? Start here"},
          { text: "Loom" },
        ],
      },
      { id: "card-2", title: "asasas" },
    ],
  },
  {
    id: "col-2",
    title: "Сегодня",
    cards: [
      {
        id: "card-3",
        title: "Начать использовать Cardify",
        labels: [
          { id: "l1", color: "#4bce97" },
          { id: "l2", color: "#e2b203" },
        ],
        watching: true,
        checklist: { done: 0, total: 4 },
        assignee: { initials: "SG", color: "#0052cc" },
      },
    ],
  },
  {
    id: "col-3",
    title: "1",
    cards: [{ id: "card-4", title: "2" }],
  },
  {
    id: "col-4",
    title: "Руководство по началу работы с Cardify",
    cards: [
      {
        id: "card-5",
        image: WORKFLOW_IMG,
        numberBadge: 2,
        title: "Фиксируйте данные из электронной почты, Slack и Teams",
        hasDescription: true,
        attachments: 1,
        checklist: { done: 0, total: 6 },
      },
      { id: "card-6", image: MOBILE_IMG, numberBadge: 4 },
    ],
  },
  {
    id: "col-5",
    title: "Позже",
    cards: [
      { id: "card-7", title: "ghghg" },
      {
        id: "card-8",
        image: APP_IMG,
        numberBadge: 3,
        title: "Изучение основ Trello",
        hasDescription: true,
        attachments: 1,
        checklist: { done: 0, total: 7 },
      },
    ],
  },
  {
    id: "col-6",
    title: "asdsad",
    cards: [
      { id: "card-9", title: "asdasdas" },
      { id: "card-10", title: "asadasd", watching: true },
      { id: "card-11", title: "asadasd" },
    ],
  },
];