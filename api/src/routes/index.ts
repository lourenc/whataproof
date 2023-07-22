import { RouteOptions } from 'fastify';

import * as itemsController from '../controllers/itemsController';
import * as requestsController from '../controllers/requestsController';

const createItem: RouteOptions = {
	method: 'POST',
	url: '/items',
	handler: itemsController.createItem,
};

const getItem: RouteOptions = {
	method: 'GET',
	url: '/items/:id',
	handler: itemsController.getItem,
};

const getRequestsRoute: RouteOptions = {
	method: 'GET',
	url: '/requests',
	handler: requestsController.getRequests,
};

const getRequestRoute: RouteOptions = {
	method: 'GET',
	url: '/requests/:id',
	handler: requestsController.getSingleRequest,
};

const postRequestRoute: RouteOptions = {
	method: 'POST',
	url: '/requests',
	handler: requestsController.addRequest,
};

const putRequestRoute: RouteOptions = {
	method: 'PUT',
	url: '/requests/:id',
	handler: requestsController.updateRequest,
};

const deleteRequestRoute: RouteOptions = {
	method: 'DELETE',
	url: '/requests/:id',
	handler: requestsController.deleteRequest,
};

const routes = [
	createItem,
	getItem,
	getRequestsRoute,
	getRequestRoute,
	postRequestRoute,
	putRequestRoute,
	deleteRequestRoute,
];

export default routes;
