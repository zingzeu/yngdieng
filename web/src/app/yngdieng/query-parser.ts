import { Query } from "./services_pb";
import { getInitialFromString, getFinalFromString, getToneFromString } from './utils';

const ACCEPTED_KEYS = new Set(["i","f","t"]);

export class QueryParser {

    /**
     * Converts a query from string to Query.
     * 
     * 1) If it is key-value pairs and all keys are recognized.
     *    => PhonologyQuery
     * 2) If it is alphanumberic => Fuzzy Pinyin Query
     * 3) Otherwise => Hanzi Query
     */
    public parse(text: string): Query | null {
        let tryResult = this.tryParseAsKeyValuePairs(text);
        if (tryResult != null) {
           let phonologyQuery = new Query.PhonologyQuery();
           if (tryResult.has("i")) {
            phonologyQuery.setInitial(
                   getInitialFromString(tryResult.get("i")));
           }
           if (tryResult.has("f")) {
                phonologyQuery.setFinal(
                    getFinalFromString(tryResult.get("f")));
           }
           if (tryResult.has("t")) {
            phonologyQuery.setTone(
                getToneFromString(tryResult.get("t")));
            }
            return new Query().setPhonologyQuery(phonologyQuery);
        }
        if (this.isAlphanumeric(text)) {
            return new Query().setFuzzyPronQuery(text.trim());
        }
        return new Query().setHanziQuery(text.trim());
    }

    private tryParseAsKeyValuePairs(text: string): Map<string, string> | null {
        let tokens = text
            .trim()
            .split(" ")
            .filter(t => t.length > 0);
        if (tokens.length == 0) {
            return null;
        }
        let output = new Map<string, string>();
        for (let token of tokens) {
            let columnPos = token.indexOf(":");
            if (columnPos < 0) {
                return null;
            }
            let key = token.substring(0, columnPos);
            let value = token.substring(columnPos+1, token.length);
            if (!ACCEPTED_KEYS.has(key)) {
                return null;
            }
            output.set(key, value);
        }
        return output.size > 0 ? output : null;
    }

    private isAlphanumeric(s: string): boolean {
        return s.match(/^[a-z0-9\s]+$/i) != null;
    }
}