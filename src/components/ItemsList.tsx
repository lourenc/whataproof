import { Item } from "../models/Item";

const items: Item[] = [
  {
    id: "1",
    meta: "shit",
  },
  {
    id: "2",
    meta: "shit",
  },
  {
    id: "3",
    meta: "shit",
  },
];

export function ItemsListItem(props: Item) {
  const link = `${window.location.hostname}/item/${props.id}`
  return (
    <div>
      <span>
        <b>ID:</b> {props.id}{" "}
      </span>
      <span>
        <b>Link:</b><a href={link}>{link}</a>
      </span>
    </div>
  );
}

export function ItemsList() {
  return (
    <div>
      {items.map((i) => (
        <ItemsListItem {...i} />
      ))}
    </div>
  );
}
