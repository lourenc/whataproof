import { useAtom } from "jotai";
import { useEffect } from "react";

import { Item } from "../models/Item";
import { itemsAtom } from "../state/items";
import { api } from "../api/api";

export function ItemsListItem(props: Item) {
  const link = `${window.location.hostname}/item/${props.id}`;
  return (
    <div>
      <span>
        <b>ID:</b> {props.id}{" "}
      </span>
      <span>
        <b>Link:</b>
        <a href={link}>{link}</a>
      </span>
    </div>
  );
}

export function ItemsList() {
  const [items, setItems] = useAtom(itemsAtom);

  useEffect(() => {
    api.getItems().then(setItems)
  }, []);

  return (
    <div>
      {items.length === 0 && <div>No items</div>}
      {items.map((i) => (
        <ItemsListItem {...i} />
      ))}
    </div>
  );
}
