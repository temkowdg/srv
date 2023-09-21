module.exports = {
    HOST: "dpg-ck69k6g8elhc73bjfpvg-a",
    USER: "grady",
    PORT: 5432,
    PASSWORD: "EAkUyXIlwXRagcEdnOHdkGgxDnRaVfuM",
    DB: "temkodb_cl2z",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// module.exports = {
//     HOST: "localhost",
//     USER: "postgres",
//     PORT: 5432,
//     PASSWORD: "postgres",
//     DB: "boomboom",
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };