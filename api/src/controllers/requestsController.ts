import boom from 'boom';
import { FastifyRequest } from 'fastify';

import Request, { RequestSchema } from '../models/Request';

const mapRequest = (request: RequestSchema) => {
	return {
		id: request.id,
		initiator: request.initiator,
		distributor: request.distributor,
		status: request.status,
		itemId: request.itemId,
		meta: request.meta,
	};
};

export const getRequests = async (req: FastifyRequest): Promise<unknown[]> => {
	try {
		const match = {};
		if (req.query.initinator) {
			Object.assign(match, { initiator: req.query.initiator });
		}
		if (req.query.distributor) {
			Object.assign(match, { distributor: req.query.distributor });
		}
		if (req.query.itemId) {
			Object.assign(match, { itemId: req.query.itemId });
		}
		const requests = await Request.find(match);
		return requests.map(mapRequest);
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const getSingleRequest = async (req: FastifyRequest) => {
	try {
		const id = req.params.id;
		const request = await Request.findById(id);
		return request;
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const addRequest = async (req: FastifyRequest) => {
	try {
		const request = new Request(req.body);
		await request.save();
                return mapRequest(request);
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const updateRequest = async (req: FastifyRequest) => {
	try {
		const id = req.params.id;
		const request = req.body;
		const { ...updateData } = request;
		const update = await Request.findByIdAndUpdate(id, updateData, { new: true });
		if (!update) {
			throw boom.notFound('Request not found');
		}
		return mapRequest(update);
	} catch (err) {
		throw boom.boomify(err);
	}
};

export const deleteRequest = async (req: FastifyRequest) => {
	try {
		const id = req.params.id;
		const request = await Request.findByIdAndRemove(id);
		if (!request) {
			throw boom.notFound('Request not found');
		}
		return mapRequest(request);
	} catch (err) {
		throw boom.boomify(err);
	}
};
