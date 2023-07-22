import { atom } from 'jotai'

import { Item } from '../models/Item'

export const itemsAtom = atom<Item[]>([])

