using System.Collections.Generic;
using System.Linq;
using Yngdieng.Backend.Db;
using Yngdieng.Common;
using Yngdieng.Protos;
using ApiWord = Yngdieng.Frontend.V3.Protos.Word;

namespace Yngdieng.Backend.Services.Frontend
{

    internal static class PronChooser
    {

        internal static ApiWord.Types.Pronunciation[] GetRecommendedPronunciations(
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Pron> pronsFromDb,
            AudioClip? preferredSandhiAudio = null
            )
        {
            var bengziFromIndex = maybeYngdiengDocument?.YngpingUnderlying;
            var sandhiFromIndex = maybeYngdiengDocument?.YngpingSandhi;
            var bengziFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.BENGZI)?.Pronunciation;
            var sandhiFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.SANDHI)?.Pronunciation;
            var bengzi = bengziFromIndex?.OrElse(bengziFromDb) ?? bengziFromDb;
            var sandhi = sandhiFromIndex?.OrElse(sandhiFromDb) ?? sandhiFromDb;

            var differentSandhiAndUnderlying = !string.IsNullOrWhiteSpace(bengzi)
                                               && !string.IsNullOrWhiteSpace(sandhi)
                                               && bengzi != sandhi
                                               && bengzi.Split().Count() > 1;
            if (differentSandhiAndUnderlying)
            {
                return new[] {
                        Pronunciations.Create("市区单字", bengzi),
                        Pronunciations.Create("市区连读", sandhi, preferredSandhiAudio)
            };
            }
            var onlyPron = string.IsNullOrEmpty(sandhi) ? bengzi : sandhi;
            return new[] {
                Pronunciations.Create("福州市区", onlyPron, preferredSandhiAudio)
            };
        }

        internal static ApiWord.Types.Pronunciation[] GetSnippetPronunciations(
            YngdiengDocument? maybeYngdiengDocument,
            IEnumerable<Pron> pronsFromDb,
            AudioClip? preferredSandhiAudio = null
            )
        {
            var bengziFromIndex = maybeYngdiengDocument?.YngpingUnderlying;
            var sandhiFromIndex = maybeYngdiengDocument?.YngpingSandhi;
            var bengziFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.BENGZI)?.Pronunciation;
            var sandhiFromDb = pronsFromDb.FirstOrDefault(p => p.SandhiCategory == SandhiCategory.SANDHI)?.Pronunciation;
            var bengzi = bengziFromIndex?.OrElse(bengziFromDb) ?? bengziFromDb;
            var sandhi = sandhiFromIndex?.OrElse(sandhiFromDb) ?? sandhiFromDb;

            var surfacedPron = string.IsNullOrEmpty(sandhi) ? bengzi : sandhi;
            return new[] {
                Pronunciations.Create("福州市区", surfacedPron, preferredSandhiAudio)
            };
        }

    }
}
