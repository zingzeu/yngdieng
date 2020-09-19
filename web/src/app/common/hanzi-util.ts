import {Hanzi} from 'yngdieng/shared/documents_pb';

export function hanziToString(h: Hanzi): string {
  if (h.hasRegular()) {
    return h.getRegular();
  }
  return h.getIds();
}
