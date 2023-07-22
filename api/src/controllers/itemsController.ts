import boom from 'boom';
import { FastifyRequest, FastifyReply } from 'fastify';

import Item, { ItemSchema } from '../models/Item';
import { ServerResponse } from 'http';

const mapItem = (item: ItemSchema) => {
    return {
        id: item.id,
        meta: item.meta,
        distributor: item.distributor,
    };
}

export const createItem = async (req: FastifyRequest): Promise<unknown> => {
	try {
		const item = await Item.create(req.body);
		return mapItem(item);
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const getItem = async (req: FastifyRequest, rep: FastifyReply<ServerResponse>): Promise<unknown> => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) return rep.code(404).send(boom.notFound('Item not found'));
		return mapItem(item);
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const getItems = async (req: FastifyRequest): Promise<unknown> => {
	try {
		const match = {};
		if (req.query.distributor) {
			Object.assign(match, { distributor: req.query.distributor });
		}
		const requests = await Item.find(match);
		return requests.map(mapItem);
	} catch (err) {
		throw boom.boomify(err);
	}
};
