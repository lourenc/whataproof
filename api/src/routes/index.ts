import { RouteOptions } from 'fastify';
import * as itemsController from '../controllers/itemsController';

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

const routes = [createItem, getItem];

export default routes;
