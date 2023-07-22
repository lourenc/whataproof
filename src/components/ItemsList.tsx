import { useAtom } from "jotai";
import { useEffect } from "react";

import { Item } from "../models/Item";
import { itemsAtom } from "../state/items";
import { api } from "../api/api";
import { useAccount } from "wagmi";

export function ItemsListItem(props: Item) {
  const getTimestampFromObjectId = (id: string) => {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000; // Convert the first 4 bytes to a timestamp in milliseconds
    const iso = new Date(timestamp).toISOString().split('T');
    const date = iso[0];
    const time = iso[1].split('.')[0];
    return date + '\n' + time;
  }

  const port = window.location.port ? `:${window.location.port}` : "";
  const link = `${window.location.protocol}//${window.location.hostname}${port}/item/${props.id}`;
  return (
    <tr>
      <td>{getTimestampFromObjectId(props.id)}</td>
      <td><a href={link}>{link}</a></td>
    </tr>
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
    <div className="nes-table-responsive">
      <table className="nes-table is-bordered is-centered">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Link</th>
          </tr>
        </thead>
        {items.length ? (
          <tbody>
            {items.map((i) => (
              <ItemsListItem {...i} />
            ))}
          </tbody>
          ) : (
            <div>No items</div>
        )}
      </table>
    </div>
  );
}
