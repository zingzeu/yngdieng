
import { Query }  from "yngdieng/shared/services_pb";
import { getInitialFromString, getFinalFromString, getToneFromString } from './utils';

const ACCEPTED_KEYS = new Set(["i", "f", "t"]);

/*
 * Query format
 *
 * "我" => HanziQuery
 * 
 *"i:l f:uang t:up_falling" => Phonology Query
 * 
 * "nguai" => Fuzzy query
 */

/**
 * Parser for a query string.
 */
export class QueryParser {

    /**
     * Converts a query from string to Query.
     * 
     * 1) If it is key-value pairs and all keys are recognized.
     *    => PhonologyQuery
     * 2) If it is alphanumberic => Fuzzy Pinyin Query
     * 3) Otherwise => Hanzi Query
     * 
     * @returns null if the query string is invalid;
     */
    public parse(text: string): Query | null {
        let tryResult = this.tryParseAsKeyValuePairs(text);
        if (tryResult != null) {
            let phonologyQuery = new Query.PhonologyQuery();
            if (tryResult.has("i")) {
                let initial = getInitialFromString(tryResult.get("i"));
                if (initial === undefined) {
                    return null;
                }
                phonologyQuery.setInitial(initial); 
            }
            if (tryResult.has("f")) {
                let final = getFinalFromString(tryResult.get("f"))
                if (final === undefined) {
                    return null;
                }
                phonologyQuery.setFinal(final);
            }
            if (tryResult.has("t")) {
                let tone = getToneFromString(tryResult.get("t"));
                if (tone === undefined) {
                    return null;
                }
                phonologyQuery.setTone(tone);
            }
            let query = new Query();
            query.setPhonologyQuery(phonologyQuery);
            return query;
        }
        if (this.isAlphanumeric(text)) {
            let query = new Query();
            query.setFuzzyPronQuery(text.trim());
            return query;
        }
        let query = new Query();
        query.setHanziQuery(text.trim());
        return query;
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
            let value = token.substring(columnPos + 1, token.length);
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