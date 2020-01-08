import "jasmine"
import { QueryParser } from "./query-parser"
import { yngdieng } from "./proto_ts"

import Initial = yngdieng.Initial;
import Final = yngdieng.Final;
import Tone = yngdieng.Tone;

describe("QueryParser", () => {

    let parser = new QueryParser();
    
    it("should parse HanziQuery", () => {
        let query = parser.parse("我");

        expect(query.getHanziQuery()).toEqual("我");
    })

    it("should parse FuzzyPronQuery", () => {
        let query = parser.parse("sieng noh");

        expect(query.fuzzyPronQuery).toEqual("sieng noh")
    })


    it("should parse PhonologyQuery with initial only", () => {
        let query = parser.parse("i:柳");

        expect(query.query).toBe("phonologyQuery");
        expect(query.phonologyQuery.initial).toEqual(Initial.L);
        expect(query.phonologyQuery.final).toEqual(Final.FINAL_UNSPECIFIED);
        expect(query.phonologyQuery.tone).toEqual(Tone.TONE_UNSPECIFIED);
    })

    it("should parse PhonologyQuery with final only", () => {
        let query = parser.parse("f:嘉");

        expect(query.phonologyQuery.initial).toEqual(Initial.INITIAL_UNSPECIFIED);
        expect(query.phonologyQuery.final).toEqual(Final.A);
        expect(query.phonologyQuery.tone).toEqual(Tone.TONE_UNSPECIFIED);
    })

    it("should parse PhonologyQuery with tone only", () => {
        let query = parser.parse("t:下去");

        expect(query.phonologyQuery.initial).toEqual(Initial.INITIAL_UNSPECIFIED);
        expect(query.phonologyQuery.final).toEqual(Final.FINAL_UNSPECIFIED);
        expect(query.phonologyQuery.tone).toEqual(Tone.DOWN_FALLING);
    })

    it("should parse PhonologyQuery with initial, final and tone", () => {
        let query = parser.parse("t:下去 f:嘉 i:求");

        expect(query.phonologyQuery.initial).toEqual(Initial.G);
        expect(query.phonologyQuery.final).toEqual(Final.A);
        expect(query.phonologyQuery.tone).toEqual(Tone.DOWN_FALLING);
    })

    it("should return null if invalid initial", () => {
        let query = parser.parse("f:開 i:K");

        expect(query).toBeNull();
    })

    it("should return null if invalid tone", () => {
        let query = parser.parse("t:下");

        expect(query).toBeNull();
    })

    it("should return null if invalid final", () => {
        let query = parser.parse("t:下去 f:我");

        expect(query).toBeNull();
    })
})