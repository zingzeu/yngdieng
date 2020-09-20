import {Hanzi} from '../../../../shared/documents_pb';

export function hanziToString(h: Hanzi): string {
  if (h.getRegular() !== '') {
    return h.getRegular();
  }
  return h.getIds();
}
