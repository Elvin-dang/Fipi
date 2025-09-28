export type Message = BaseMessage & Payload;

export type Payload =
  | OfferPayload
  | AnswerPayload
  | CandidatePayload
  | RequestPayload
  | AcceptPayload
  | RejectPayload
  | FileSendingPayload
  | FileCompletePayload
  | WavingPayload;

export interface BaseMessage {
  sender: string;
  receiver: string;
}

export interface OfferPayload {
  type: "OFFER";
  payload: {
    sdp: RTCSessionDescriptionInit;
  };
}

export interface AnswerPayload {
  type: "ANSWER";
  payload: {
    sdp: RTCSessionDescriptionInit;
  };
}

export interface CandidatePayload {
  type: "CANDIDATE";
  payload: {
    candidate: RTCIceCandidate;
  };
}

export interface RequestPayload {
  type: "REQUEST";
  payload: {
    file: {
      name: string;
      type: string;
      size: number;
      chunkSize: number;
    };
  };
}

export interface AcceptPayload {
  type: "ACCEPT";
  payload: {};
}

export interface RejectPayload {
  type: "REJECT";
  payload: {};
}

export interface FileSendingPayload {
  type: "FILE_SENDING";
  payload: {};
}

export interface FileCompletePayload {
  type: "FILE_COMPLETE";
  payload: {};
}

export interface WavingPayload {
  type: "WAVING";
  payload: {};
}
