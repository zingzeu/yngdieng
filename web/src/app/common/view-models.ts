
export interface SearchResultItemViewModel {
    hanziCanonical: string;
    hanziAlternatives: string[];
    buc: string;
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