import {getSuperhero, getSuperheroes, addVote, getRecentVote} from "../sqlite.js";
import {uuid} from "../utils.js";

async function getHandler(request, reply) {
    const {super_uid, vote_time} = request.cookies;

    if (typeof super_uid === "string" && typeof vote_time === "string") {
        const hero = await getRecentVote(super_uid);
        return reply.view("/src/pages/already_voted.hbs", {hero, time:vote_time});
    }

    const userId = typeof super_uid === "string" ? super_uid : uuid();

    const heroes = await getSuperheroes();
    return reply
        .cookie("super_uid",userId)
        .view("/src/pages/index.hbs", {heroes});
}

async function postHandler(request, reply) {
    const {super_uid} = request.cookies;
    let hero;

    if (request.body.superhero) {
        try {
            const superheroId = parseInt(request.body.superhero);
            if (!Number.isNaN(superheroId)) {
                await addVote(super_uid, superheroId);
                hero = await getSuperhero(superheroId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const now = new Date();
    let hours = now.getHours();
    const pm = hours >= 12;
    hours = hours > 12 ? (hours - 12) : hours;

    let minutes = now.getMinutes();
    minutes = `${minutes < 10 ? "0" :""}${minutes}`;

    const voteTime = `${hours}:${minutes}${pm ? "pm":"am"}`;

    return reply
        .cookie("super_uid",super_uid)
        .cookie("vote_time", voteTime)
        .view("/src/pages/thanks.hbs", {hero});
}

export {
    getHandler,
    postHandler,
};
