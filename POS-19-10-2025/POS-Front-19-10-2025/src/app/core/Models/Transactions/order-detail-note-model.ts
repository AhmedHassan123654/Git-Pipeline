import { NoteModel } from "./note-model";
export class OrderDetailNoteModel {
  public DocumentId: string;
  public Id: number;
  public OrderDetailId: string;
  public NoteId: number;
  public NoteDocumentId: string;

  public NoteName: string;
  public IsDeleted: boolean;
  public IsSync: boolean;
}
