import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";

const server = http.createServer(async (req, res) => {
	const { method, url } = req;
	const { pathname } = new URL(req.url || "", `http://${req.headers.host}`);

	await json(req, res);

	const router = routes.find((req) => {
		return req.method === method && req.path === pathname;
	});

	if (router) {
		return router.handler(req, res);
	}

	return res.writeHead(404).end();
});

server.listen(3333);
