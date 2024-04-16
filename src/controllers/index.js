import { formatInTimeZone } from 'date-fns-tz';
import {getSuperhero, getSuperheroes, addVote, getRecentVote} from "../sqlite.js";
import {uuid} from "../utils.js";

const DAY_IN_SECONDS = 24 * 60 * 60;
const MINUTE = 60;

async function getHandler(request, reply) {
    const {super_uid, vote_time} = request.cookies;

    if (typeof super_uid === "string" && typeof vote_time === "string") {
        const hero = await getRecentVote(super_uid);
        return reply.view("/src/pages/already_voted.hbs", {hero, time:vote_time});
    }

    const userId = typeof super_uid === "string" ? super_uid : uuid();

    const heroes = await getSuperheroes();
    return reply
        .cookie("super_uid",userId, { maxAge: DAY_IN_SECONDS * 7 })
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

    // When running on Glitch, the timezone is in the USA
    const voteTime = formatInTimeZone(new Date(), "Australia/Melbourne", "h:mma");

    return reply
        .cookie("super_uid",super_uid, { maxAge: DAY_IN_SECONDS * 7 })
        .cookie("vote_time", voteTime, { maxAge: 2 * MINUTE })
        .view("/src/pages/thanks.hbs", {hero});
}

export {
    getHandler,
    postHandler,
};
