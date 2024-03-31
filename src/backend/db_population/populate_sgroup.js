const { warnDbChanges } = require("../db_func");
const Domain = require("../schemas/Domain");
const {DB_URI} = require("../constants");
const mongoose = require('mongoose');


async function populate_sgroup() {

    await Domain.deleteMany({}); // delete all domains

    const group1 = await Domain.create({
        groupNum:      1,
        client_id:     "cs3099-g1",
        client_secret: "DIiorNA4fWtGYO3NBd56EdFO6Md4xK62wvZGA3dG1eNKlmYUJma1QJu10RO6jz2c6PXGX6JeuF7DNeslGUmU5gbZmC3dWl86kFPGlUYhTywEPygA6CsDAl6f8U8hOZPDFIv2pwd6NbAX7mn5CbVZc7k2sQxSXGBYPguLpVlKInmhG9wV8zJoyAkKMTufmsHc1nd6TP58W4nazDdAmiECRgUmGHdkOvQwODOHYV3ldJmKAq0MTMrsNjHXKVxZIrmsAIZmIikZaI4Zti7k5yZLwzAyRDJ5dwVermLoFbj2XoPAVv8RI9voHPOpOLBoTuaK",
        redirect_url:  "https://cs3099user01.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    const group2 = await Domain.create({
        groupNum:      2,
        client_id:     "aces_g2",
        client_secret: "rv7zlvkfa30dr46v6y7fnwz8zvb9uijrqq5q1w2mlknoyyx8mpvollc1g6fhwsdpsweoq69dmbqu8bpkqak1ekw8ag2gdzvmjfr3ja5xlkmal8tlgu64csddow48711pq61je8ibt7fft53l4s94ik8wq1zthbw39rod5eght70wqvbbkislurptam9imo41jpfqmjn0eujg20fayb8r783teeepvrnko848bmbf1gdkz9eogohqsp84owpy8t3x",
        redirect_url:  "https://cs3099user02.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    const group3 = await Domain.create({
        groupNum:      3,
        client_id:     "cs3099group03",
        client_secret: "wxhsoESvXI18ezjSGTYV2V3yqKNgJWqFNvTj2G7GOgmBpx1BCwFrEu3UAQq5n6cMXuJW73Gg1aagbHmcqsby9unlhDaN1aBgtba3",
        redirect_url:  "https://cs3099user03.host.cs.st-andrews.ac.uk/api/oauth/redirect"
    });

    const group4 = await Domain.create({
        groupNum:      4,
        client_id:     "cs3099-g4",
        client_secret: "2d39ab2a49b691f5cab7bbbdc46e2f01c67bb0921a816472f768f9bae3abb52b702708c8e72f54712254fd16e3b08ac30b877bf968305092d72b6b7e92397f6d1ed8d288eef8397a112d6decfbc99ed20186a62df26639e110c699e59f959aa9470147387e7807ba31af2cd01766d39d57a56aa94087246aa14d904da624401f",
        redirect_url:  "https://cs3099user04.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    const group5 = await Domain.create({
        groupNum:      5,
        client_id:     "aces5",
        client_secret: "TOk03wZOjy2ZNvSkGKzX6YUcvK5udxILmKF03K5ImehmGB8Jqibwp5awcHuaDx0mtoCY83e3KcWifeDddsEyugcHM1o9j0blDVxMOeOwVNymlEeHWtgfcgT1XS91iLg6PKqCuuAAZvS3k2mjl0npOIE3hQNJp5I7HSBrgC12y298RHmGW3infRDlMqLIzBMFi3jrJN6A8oqeBEgdnwepovYpTqkk7k5e6iJA2n181zUFnQeLpwvKm8dnFsxRUCy7j38QwVLPDYvOm4fMMFxo2eFHWer67HQ9fqhu8KqISyIGzotVn9Zh8s9BNrnVUpUk",
        redirect_url:  "https://cs3099user05.host.cs.st-andrews.ac.uk/backend/oauth/redirect"
    });

    const group6 = await Domain.create({
        groupNum:      6,
        client_id:     "g6",
        client_secret: "0001001000010111110100000110001111010110100010110111000000100100110101111101110001111110101101100001010110001000101100010110111001111110110011010000111101101001011011010101110101001000110011000010010100000111010111000110001110100110010100001100011110111110",
        redirect_url:  "https://cs3099user06.host.cs.st-andrews.ac.uk/oauth/redirect"
    });
  
    const group7 = await Domain.create({
        groupNum:      7,
        client_id:     "aces-g7",
        client_secret: "Ey1SNTG2bQxrfTV6bkgk2Gj6SXIxq3Q20IS10hdEelYU1Od2XuiXkWokWmZ2L609bhJKzLkHFisgT9kYSo3ZeaSIEzxbtzJzc4ymrECTmfUPTFRWZ9KJyMrrm6dQUDRGl3Xd6Qkt8qRJXclwV4xzrnAtzFyHNOa5Ld5RqmpW6qTAf3EnwWJQeI3gfpDyUkmKxMzrAS8jXudm0dS0uej7FkgNEGPMpY5NU7wMQftoB15pAXBc9Xl0kseNEWRcTAjLaZ56R7CwHYpGn2W1Gm3So2rNWQ1Xe8YXPzmGSIZqUu4f2E7gh0TXCfF9HlcNOYLm",
        redirect_url:  "https://cs3099user07.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    const group8 = await Domain.create({ 
        groupNum:      8,
        client_id:     "aces-eight",
        client_secret: "5um608eo6ejt9wuiqqf7miikuqxexgtzeu5kbvv2jz8cnmtmnhpkxowzqcje1r2f",
        redirect_url:  "https://cs3099user08.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    const group9 = await Domain.create({
        groupNum:      9,
        client_id:     "aces-g9",
        client_secret: "tSOOeUSId0ZSRVaW0Y8mbG9FZ4u6MARPtCnCeDYcq3VRiR9XJzO6qrf9T9T3jTyL22gghmBufr7JtJ6ngU9UHiHMEyzxsHRBahnTnpgX78bHQee2MSfotH34xkAVrOKIj5LUYXnOBAQUVvx1pVVaf9",
        redirect_url:  "https://cs3099user09.host.cs.st-andrews.ac.uk/oauth/redirect"
    });

    console.log("Done!");
    process.exit();

}

if (warnDbChanges("Domain")) { // if user agrees
    mongoose.connect(DB_URI);
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB connection established");
    });
    console.log("Commencing domain population");
    populate_sgroup();
}