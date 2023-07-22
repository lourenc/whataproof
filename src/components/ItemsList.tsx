import { useAtom } from "jotai";
import { useEffect } from "react";

import { Item } from "../models/Item";
import { itemsAtom } from "../state/items";
import { api } from "../api/api";
import { useAccount } from "wagmi";

export function ItemsListItem(props: Item) {
  const shortenString = (text: string) => (text.length > 12)? text.slice(0, 6) + ".." + text.slice(-6) : text;
  const handleTdClick = (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, fullText: string) => {
    const td = event.target as HTMLTableCellElement;
    const currentText = td.innerText;

    if (currentText === shortenString(fullText)) {
      td.innerText = fullText;
    } else {
      td.innerText = shortenString(fullText);
    }
  };
  const port = window.location.port ? `:${window.location.port}` : "";
  const link = `${window.location.protocol}//${window.location.hostname}${port}/item/${props.id}`;
  return (
    <tr>
      <td className="on-hover-blue" onClick={(e) => handleTdClick(e, props.id)}>{shortenString(props.id)}</td>
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
            <th>ItemId</th>
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
            <div>No requests</div>
        )}
      </table>
    </div>
  );
}
