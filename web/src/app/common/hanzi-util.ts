import {Hanzi} from 'yngdieng/shared/documents_pb';

export function getHanziString(h: Hanzi): string {
  if (h.hasRegular()) {
    return h.getRegular();
  }
  return h.getIds();
}