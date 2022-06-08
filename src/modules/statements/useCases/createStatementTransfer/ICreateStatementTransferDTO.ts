import { Statement } from "../../entities/Statement";

export type ICreateStatementTransferDTO = Pick<
  Statement,
  "user_id" | "sender_id" | "description" | "amount"
>;
