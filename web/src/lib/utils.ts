import {Final, Initial, Tone} from '../../../shared/phonology_pb';

const INITIAL_TO_HANZI_MAPPING = {
  [Initial.L]: '柳',
  [Initial.B]: '邊',
  [Initial.G]: '求',
  [Initial.K]: '氣',
  [Initial.D]: '低',
  [Initial.P]: '波',
  [Initial.T]: '他',
  [Initial.Z]: '曾',
  [Initial.N]: '日',
  [Initial.S]: '時',
  [Initial.NONE]: '鶯',
  [Initial.M]: '蒙',
  [Initial.NG]: '語',
  [Initial.C]: '出',
  [Initial.H]: '非',
};

const HANZI_TO_INITIAL_MAPPING = reverseMap(INITIAL_TO_HANZI_MAPPING);

const FINAL_TO_HANZI_MAPPING = {
  [Final.UNG]: '春',
  [Final.UA]: '花',
  [Final.YONG]: '香',
  [Final.IU]: '秋',
  [Final.ANG]: '山',
  [Final.AI]: '開',
  [Final.A]: '嘉',
  [Final.ING]: '賓',
  [Final.UANG]: '歡',
  [Final.O]: '歌',
  [Final.Y]: '須',
  [Final.UOI]: '杯',
  [Final.U]: '孤',
  [Final.EING]: '燈',
  [Final.UONG]: '光',
  [Final.UI]: '輝',
  [Final.IEU]: '燒',
  [Final.YNG]: '銀',
  [Final.ONG]: '釭',
  [Final.I]: '之',
  [Final.OENG]: '東',
  [Final.AU]: '郊',
  [Final.UO]: '過',
  [Final.E]: '西',
  [Final.IO]: '橋',
  [Final.IE]: '雞',
  [Final.IANG]: '聲',
  [Final.OEY]: '催',
  [Final.OE]: '初',
  [Final.IENG]: '天',
  [Final.IA]: '奇',
  [Final.UAI]: '歪',
  [Final.EU]: '溝',
};

const HANZI_TO_FINAL_MAPPING = reverseMap(FINAL_TO_HANZI_MAPPING);

const TONE_TO_HANZI_MAPPING = {
  [Tone.UP_LEVEL]: '上平',
  [Tone.UP_UP]: '上上',
  [Tone.UP_FALLING]: '上去',
  [Tone.UP_ABRUPT]: '上入',
  [Tone.DOWN_LEVEL]: '下平',
  [Tone.DOWN_FALLING]: '下去',
  [Tone.DOWN_ABRUPT]: '下入',
};

const HANZI_TO_TONE_MAPPING = reverseMap(TONE_TO_HANZI_MAPPING);

export function getInitialString(initial): string {
  return INITIAL_TO_HANZI_MAPPING[initial];
}

export function getInitialFromString(s: string): Initial {
  return HANZI_TO_INITIAL_MAPPING[s];
}

export function getFinalString(final: Final): string {
  return FINAL_TO_HANZI_MAPPING[final];
}

export function getFinalFromString(s: string): Final {
  return HANZI_TO_FINAL_MAPPING[s];
}

export function getToneString(tone: Tone): string {
  return TONE_TO_HANZI_MAPPING[tone];
}

export function getToneFromString(s: string): Tone {
  return HANZI_TO_TONE_MAPPING[s];
}

function reverseMap(input: any): {[x: string]: any} {
  let output = {};
  for (let k in input) {
    output[input[k]] = k;
  }
  return output;
}
