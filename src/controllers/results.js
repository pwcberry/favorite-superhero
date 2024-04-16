/**
 * Controller functions to display the results page
 */
import {getResults} from "../sqlite.js";

async function getHandler(request, reply){
    const results = await getResults();
    return reply.view("/src/pages/results.hbs", { results });
}

export {
    getHandler,
};
