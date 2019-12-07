import { QueryParser } from "./query-parser"
import { Initial, Final, Tone } from "./phonology_pb"

describe("QueryParser", () => {

    let parser = new QueryParser();
    
    it("should parse HanziQuery", () => {
        let query = parser.parse("我");

        expect(query.hasHanziQuery()).toBe(true);
        expect(query.getHanziQuery()).toEqual("我")
    })

    it("should parse FuzzyPronQuery", () => {
        let query = parser.parse("sieng noh");

        expect(query.hasFuzzyPronQuery()).toBe(true);
        expect(query.getFuzzyPronQuery()).toEqual("sieng noh")
    })


    it("should parse PhonologyQuery with initial only", () => {
        let query = parser.parse("i:柳");

        expect(query.hasPhonologyQuery()).toBe(true);
        expect(query.getPhonologyQuery().getInitial()).toEqual(Initial.L);
        expect(query.getPhonologyQuery().getFinal()).toEqual(Final.FINAL_UNSPECIFIED);
        expect(query.getPhonologyQuery().getTone()).toEqual(Tone.TONE_UNSPECIFIED);
    })

    it("should parse PhonologyQuery with final only", () => {
        let query = parser.parse("f:嘉");

        expect(query.hasPhonologyQuery()).toBe(true);
        expect(query.getPhonologyQuery().getInitial()).toEqual(Initial.INITIAL_UNSPECIFIED);
        expect(query.getPhonologyQuery().getFinal()).toEqual(Final.A);
        expect(query.getPhonologyQuery().getTone()).toEqual(Tone.TONE_UNSPECIFIED);
    })

    it("should parse PhonologyQuery with tone only", () => {
        let query = parser.parse("t:下去");

        expect(query.hasPhonologyQuery()).toBe(true);
        expect(query.getPhonologyQuery().getInitial()).toEqual(Initial.INITIAL_UNSPECIFIED);
        expect(query.getPhonologyQuery().getFinal()).toEqual(Final.FINAL_UNSPECIFIED);
        expect(query.getPhonologyQuery().getTone()).toEqual(Tone.DOWN_FALLING);
    })

    it("should parse PhonologyQuery with initial, final and tone", () => {
        let query = parser.parse("t:下去 f:嘉 i:求");

        expect(query.hasPhonologyQuery()).toBe(true);
        expect(query.getPhonologyQuery().getInitial()).toEqual(Initial.G);
        expect(query.getPhonologyQuery().getFinal()).toEqual(Final.A);
        expect(query.getPhonologyQuery().getTone()).toEqual(Tone.DOWN_FALLING);
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