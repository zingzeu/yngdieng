﻿using System.Collections.Generic;
using System.Linq;
using Yngdieng.Admin.V1.Protos;

namespace Yngdieng.Backend.Services.Admin
{
    public static class Renderers
    {


        public static Word ToWord(Db.Word word)
        {
            return ToWord(word, new PronRef[] { });
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
    }
}