
export interface MonoHanziResultViewModel {
    id: string;
    hanziCanonical: string;
    hanziAlternatives: string[];
    yngping: string;
    initial: string;
    final: string;
    tone: string;
    ciklinSource: string | null;
    dfdSource: string | null;
}

export interface FengResultViewModel {
    _type: string;
    yngping: string;
    hanzi: string;
    explanation: string;
    id: string;
}