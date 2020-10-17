using System.Collections.Generic;
using System.Linq;
using Yngdieng.Admin.V1.Protos;
using static Yngdieng.Backend.Services.Admin.EnumConversions;

namespace Yngdieng.Backend.Services.Admin
{
    public static class Renderers
    {


        public static Word ToWord(Db.Word word)
        {
            return ToWord(word, new PronRef[] { });
        }

        public static Word ToWord(Db.WordWithPronIds word)
        {
            return ToWord(new Db.Word
            {
                WordId = word.WordId,
                Hanzi = word.Hanzi,
                HanziAlternatives = word.HanziAlternatives,
                MandarinWords = word.MandarinWords,
                Gloss = word.Gloss,
            }, word.PronIds.Select(x => new PronRef { WordId = word.WordId, PronId = x }));
        }
        public static Word ToWord(Db.Word word, IEnumerable<PronRef> pronRefs)
        {
            return new Word
            {
                Name = ResourceNames.ToWordName(new WordRef { WordId = word.WordId }),
                Hanzi = word.Hanzi,
                HanziAlternatives = { word.HanziAlternatives },
                MandarinWords = { word.MandarinWords },
                Gloss = word.Gloss ?? string.Empty,
                Prons = { pronRefs.Select(p => ResourceNames.ToPronName(p)) }
            };
        }

        public static Pron ToPron(Db.Pron pron)
        {
            return new Pron
            {
                Name = ResourceNames.ToPronName(new PronRef { WordId = pron.WordId, PronId = pron.PronId }),
                Pronunciation = pron.Pronunciation,
                Variant = DbVariantToProtoVariant[pron.Variant ?? Db.Variant.UNSPECIFIED],
                SandhiCategory = DbSCToProtoSC[pron.SandhiCategory ?? Db.SandhiCategory.UNSPECIFIED],
                Weight = pron.Weight ?? 0,
            };
        }
    }
}
