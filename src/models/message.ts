export interface Message {
  sender: string;
  receiver: string;
  type: "REQUEST" | "ACCEPT" | "REJECT";
  payload: {
    file: {
      name: string;
      type: string;
      size: number;
    };
  };
}
