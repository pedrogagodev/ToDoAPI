import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-paths.js";

const database = new Database();

export const routes = [
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const tasks = database.select("tasks");

			return res.end(JSON.stringify(tasks));
		},
	},
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { title, description } = req.body;

			const task = {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date().toLocaleDateString(),
				updated_at: new Date().toLocaleDateString(),
			};

			database.insert("tasks", task);

			return res.writeHead(201).end();
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { title, description } = req.body;

			if (!title && !description) {
				return res
					.writeHead(400)
					.end(
						JSON.stringify({ message: "title or description are required" }),
					);
			}

			const [task] = database.select("tasks", { id });

			if (!task) {
				return res.writeHead(404).end();
			}

			database.update("tasks", id, {
				title: title ?? task.title,
				description: description ?? task.description,
				updated_at: new Date().toLocaleDateString(),
			});

			return res.writeHead(204).end();
		},
	},
	{
		method: "PATCH",
		path: buildRoutePath("/tasks/:id/complete"),
		handler: (req, res) => {
			const { id } = req.params;
			const [task] = database.select("tasks", { id });

			if (!task) {
				return res.writeHead(404).end();
			}

			const isTaskCompleted = !!task.completed_at;
			const completed_at = isTaskCompleted
				? null
				: new Date().toLocaleDateString();

			database.update("tasks", id, { completed_at });

			return res.writeHead(204).end();
		},
	},
	{
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;

			database.delete("tasks", id);

			return res.writeHead(204).end();
		},
	},
];
