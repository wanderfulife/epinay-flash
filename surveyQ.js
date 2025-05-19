export const questions = [
    {
        id: "Q4",
        text: "Pour quelle raison êtes vous stationnés ici ?",
        options: [
            { id: 1, text: "Pour le marché", next: "Q5" },
            { id: 2, text: "Pour des achats, courses (hors marché)", next: "Q5" },
            { id: 3, text: "Lieu de travail habituel", next: "Q5" },
            { id: 4, text: "Le domicile", next: "Q5" },
            { id: 5, text: "Autre", next: "Q4Precision" }
        ]
    },
    {
        id: "Q4Precision",
        text: "Précisez la raison",
        freeText: true,
        next: "Q5"
    },
    {
        id: "Q5",
        text: "Combien de temps allez-vous rester garés ici ?",
        options: [
            { id: 1, text: "15 minutes", next: "Q6" },
            { id: 2, text: "30 minutes", next: "Q6" },
            { id: 3, text: "45 minutes", next: "Q6" },
            { id: 4, text: "60 minutes", next: "Q6" },
            { id: 5, text: "90 minutes", next: "Q6" },
            { id: 6, text: "120 minutes", next: "Q6" },
            { id: 7, text: "Plus de 2 heures", next: "Q6" }
        ]
    },
    {
        id: "Q6",
        text: "Quelle est votre commune de résidence ?",
        options: [
            { id: 1, text: "Croix", next: "Quartier" },
            { id: 2, text: "Autre commune", next: "Q6Precision" }
        ]
    },
    {
        id: "Q6Precision",
        text: "Précisez votre commune",
        freeText: true,
        next: "Q7"
    },
    {
        id: "Q7",
        text: "Combien de fois par semaine garez-vous votre véhicule sur ce parking ?",
        freeText: true,
        next: "end"
    },
    {
        id: "Quartier",
        text: "Dans quel quartier de Croix résidez-vous ?",
        options: [
            { id: 1, text: "Barbieux", next: "end" },
            { id: 2, text: "Beaumont", next: "end" },
            { id: 3, text: "Canal", next: "end" },
            { id: 4, text: "Centre", next: "end" },
            { id: 5, text: "Croix Blanche", next: "end" },
            { id: 6, text: "Fer à Cheval", next: "end" },
            { id: 7, text: "Mackellerie", next: "end" },
            { id: 8, text: "Planche Epinoy", next: "end" },
            { id: 9, text: "Saint Martin", next: "end" },
            { id: 10, text: "Saint-Pierre", next: "end" },
            { id: 11, text: "Autre", next: "QuartierPrecision" }
        ]
    },
    {
        id: "QuartierPrecision",
        text: "Précisez le quartier",
        freeText: true,
        next: "end"
    }
];