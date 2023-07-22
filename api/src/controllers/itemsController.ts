import boom from 'boom';
import { FastifyRequest, FastifyReply } from 'fastify';

import Item from '../models/Item';
import { ServerResponse } from 'http';

export const createItem = async (req: FastifyRequest): Promise<unknown> => {
	try {
		const item = await Item.create({ meta: req.body.meta });
		return { id: item.id, meta: item.meta };
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const getItem = async (req: FastifyRequest, rep: FastifyReply<ServerResponse>): Promise<unknown> => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) return rep.code(404).send(boom.notFound('Item not found'));
		return { id: item.id, meta: item.meta };
	} catch (err) {
		throw boom.boomify(err);
	}
};
