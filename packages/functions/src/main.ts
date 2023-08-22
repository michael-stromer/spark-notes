import { list } from "./list";
import { create } from "./create";
import { update } from "./update";
import { deleteNote } from "./delete";
import { get } from "./get";

export async function handler(event) {
  switch (event.info.fieldName) {
    case "listNotes":
      return await list(event);
    case "createNote":
      return await create(event);
    case "updateNote":
      return await update(event);
    case "deleteNote":
      return await deleteNote(event);
    case "getNoteById":
      return await get(event);
    default:
      return null;
  }
}
