module.exports = {
    links: [
        {
            source: 0,
            target: 1,
        },
        {
            source: 0,
            target: 2,
        },
        {
            source: 0,
            target: 3,
        },
        {
            source: 2,
            target: 3,
        },
    ],
    nodes: [
        {
            id: 0,
            name: "Mary",
            gender: "female",
            hasCar: false,
            hasBike: false,
        },
        {
            id: 1,
            name: "Roy",
            gender: "male",
            hasCar: false,
            hasBike: true,
        },
        {
            id: 2,
            name: "Frank",
            gender: "male",
            hasCar: true,
            hasBike: true,
        },
        {
            id: 3,
            name: "Melanie",
            gender: "female",
            hasCar: true,
            hasBike: false,
        },
    ],
};
