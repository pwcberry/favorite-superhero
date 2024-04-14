import { getSuperheroes, addVote } from "../sqlite.js";
import { uuid } from "../utils.js";

const USER_ID = uuid();

async function getHandler(request, reply){
    const heroes = await getSuperheroes();
    return reply.view("/src/pages/index.hbs", { heroes });
}

async function postHandler(request, reply) {
    if (request.body.superhero) {
        try {
            await addVote(USER_ID, parseInt(request.body.superhero));
        } catch(error) {
            console.error(error);
        }
    }
    return reply.view("/src/pages/thanks.hbs");
}

export {
    getHandler,
    postHandler,
};
