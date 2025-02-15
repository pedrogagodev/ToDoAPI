import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
	const { method, url } = req;

	await json(req, res);

	const router = routes.find((req) => {
		return req.method === method && req.path.test(url);
	});

	if (router) {
		const routeParams = req.url.match(router.path);
		const { query, ...params } = routeParams.groups;

		req.params = params;
		req.query = query ? extractQueryParams(query) : {};

		return router.handler(req, res);
	}

	return res.writeHead(404).end();
});

server.listen(3333);
