export const questions = [
  {
    id: "Q1",
    text: "Où avez-vous prévu de vous stationner ?",
    options: [
      { id: 1, text: "Une des rues proche de la gare", next: "end" },
      { id: 2, text: "Parking du centre-commercial Carrefour", next: "end" },
      { id: 3, text: "Autre gare : Précisez laquelle", next: "end" },
      { id: 4, text: "Autre : Précisez", next: "Q1_autre" }
    ]
  },

  {
    id: "Q1_autre",
    text: "Précisez",
    freeText: true,
    next: "end"
  },
];