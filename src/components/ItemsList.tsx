import { useAtom } from "jotai";
import { useEffect } from "react";

import { Item } from "../models/Item";
import { itemsAtom } from "../state/items";
import { api } from "../api/api";
import { useAccount } from "wagmi";

export function ItemsListItem(props: Item) {
  const port = window.location.port ? `:${window.location.port}` : "";
  const link = `${window.location.protocol}//${window.location.hostname}${port}/item/${props.id}`;
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
  const account = useAccount();

  useEffect(() => {
    if (!account.address) {
      return;
    }
    api.getItems(account.address).then(setItems);
  }, [account.address]);

  return (
    <div>
      {items.length === 0 && <div>No items</div>}
      {items.map((i) => (
        <ItemsListItem {...i} />
      ))}
    </div>
  );
}
