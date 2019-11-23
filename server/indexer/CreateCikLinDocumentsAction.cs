using System;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using Yngdieng.Protos;
using System.IO;
using System.Collections.Generic;

namespace Yngdieng.Indexer
{
    public sealed class CreateCikLinDocumentsAction
    {
        private static readonly IDictionary<char, Initial> CharToInitial = new Dictionary<char, Initial>() {
            {'柳', Initial.L},
            {'邊', Initial.B},
            {'求', Initial.G},
            {'氣', Initial.K},
            {'低', Initial.D},
            {'波', Initial.P},
            {'他', Initial.T},
            {'曾', Initial.Z},
            {'日', Initial.N},
            {'時', Initial.S},
            {'鶯', Initial.None},
            {'蒙', Initial.M},
            {'語', Initial.Ng},
            {'出', Initial.C},
            {'非', Initial.H}
        };

        private static readonly IDictionary<char, Final> CharToFinal = new Dictionary<char, Final>() {
            {'春', Final.Ung},
            {'花', Final.Ua},
            {'香', Final.Yong},
            {'秋', Final.Iu},
            {'山', Final.Ang},
            {'開', Final.Ai},
            {'嘉', Final.A},
            {'賓', Final.Ing},
            {'歡', Final.Uang},
            {'歌', Final.O},
            {'須', Final.Y},
            {'杯', Final.Uoi},
            {'孤', Final.U},
            {'燈', Final.Eing},
            {'光', Final.Uong},
            {'輝', Final.Ui},
            {'燒', Final.Ieu},
            {'銀', Final.Yng},
            {'釭', Final.Ong},
            {'之', Final.I},
            {'東', Final.Oeng},
            {'郊', Final.Au},
            {'過', Final.Uo},
            {'西', Final.E},
            {'橋', Final.Io},
            {'雞', Final.Ie},
            {'聲', Final.Iang},
            {'催', Final.Oey},
            {'初', Final.Oe},
            {'天', Final.Ieng},
            {'奇', Final.Ia},
            {'歪', Final.Uai},
            {'溝', Final.Eu},
        };

        private readonly string _outputFolder;
        private readonly string _cikLinCsvFile;

        public CreateCikLinDocumentsAction(string cikLinCsvFile, string outputFolder)
        {
            _cikLinCsvFile = cikLinCsvFile;
            _outputFolder = outputFolder;
        }

        public void Run()
        {
            using (var reader = new StreamReader(_cikLinCsvFile))
            {
                using (var csv = new CsvReader(reader))
                {
                    var records = csv.GetRecords<CikLinRow>();
                    foreach (var r in records)
                    {
                        if (!CharToFinal.ContainsKey(r.Final[0])) {
                            Console.WriteLine($"Skipping {r.Id}, unknown Final {r.Final}");
                            continue;
                        }
                        var document = new Document
                        {
                            Id = r.Id,
                            HanziCanonical = StringToHanziProto(r.Hanzi),
                            Initial = CharToInitial[r.Initial[0]],
                            Final = CharToFinal[r.Final[0]],
                            Tone = IntToTone(r.Tone),
                            Ciklin = new Document.Types.CikLinSourceInfo()
                        };
                        if (r.HanziEquiv.Length>0) {
                            document.HanziAlternatives.Add(StringToHanziProto(r.HanziEquiv));
                        }
                         if (r.HanziAlt.Length>0) {
                            document.HanziAlternatives.Add(StringToHanziProto(r.HanziAlt));
                        }
                        Console.WriteLine(document);
                    }
                }
            }
        }

        private Hanzi StringToHanziProto(string hanzi)
        {
            if (HasIDS(hanzi))
            {
                return new Hanzi { Ids = hanzi };
            }
            else
            {
                return new Hanzi { Regular = hanzi };
            }
        }

        private static bool HasIDS(string hanzi)
        {
            foreach (var c in GetUnicodeCodePoints(hanzi))
            {
                if (0x2ff0 <= c && c <= 0x2fff)
                {
                    return true;
                }
            }
            return false;
        }

        private static int[] GetUnicodeCodePoints(string input)
        {
            var output = new List<int>();
            for (var i = 0; i < input.Length; i += char.IsSurrogatePair(input, i) ? 2 : 1)
            {
                var codepoint = char.ConvertToUtf32(input, i);
                output.Add(codepoint);
            }
            return output.ToArray();
        }

        private static Tone IntToTone(int toneNumber) {
            switch (toneNumber) {
                case 1:
                    return Tone.UpLevel;
                case 2:
                    return Tone.UpUp;
                case 3:
                    return Tone.UpFalling;
                case 4: 
                    return Tone.UpAbrupt;
                case 5:
                    return Tone.DownLevel;
                case 7:
                    return Tone.DownFalling;
                case 8:
                    return Tone.DownAbrupt;
                default:
                    throw new Exception("Unknown tone");
            }
        }
    }

    sealed class CikLinRow
    {
        [Index(0)]
        public int Id { get; set; }

        [Index(1)]
        public string Hanzi { get; set; }

        [Index(2)]
        public string HanziEquiv { get; set; }

        [Index(3)]
        public string HanziAlt { get; set; }

        [Index(4)]
        public string Initial { get; set; }

        [Index(5)]
        public string Final { get; set; }

        [Index(6)]
        public int Tone { get; set; }
    }
}