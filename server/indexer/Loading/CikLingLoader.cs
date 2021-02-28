using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using Yngdieng.Protos;
using static Yngdieng.Common.FoochowRomanziedUtils;
using static Yngdieng.Common.HanziUtils;

namespace Yngdieng.Indexer.Loading
{
    public sealed class CikLingLoader
    {
        private static readonly IDictionary<char, Initial> CharToInitial =
            new Dictionary<char, Initial>(){{'柳', Initial.L},
                                            {'邊', Initial.B},
                                            {'求', Initial.G},
                                            {'氣', Initial.K},
                                            {'悉', Initial.K},
                                            {'低', Initial.D},
                                            {'聲', Initial.D},
                                            {'波', Initial.P},
                                            {'他', Initial.T},
                                            {'皆', Initial.T},
                                            {'曾', Initial.Z},
                                            {'之', Initial.Z},
                                            {'日', Initial.N},
                                            {'女', Initial.N},
                                            {'時', Initial.S},
                                            {'授', Initial.S},
                                            {'鶯', Initial.None},
                                            {'亦', Initial.None},
                                            {'蒙', Initial.M},
                                            {'美', Initial.M},
                                            {'語', Initial.Ng},
                                            {'鳥', Initial.Ng},
                                            {'出', Initial.C},
                                            {'非', Initial.H},
                                            {'風', Initial.H}};
        // TODO: use libhokchew
        private static readonly IDictionary<char, Final> CharToFinal =
            new Dictionary<char, Final>(){
               {'春', Final.Ung},
            {'公', Final.Ung},
            {'花', Final.Ua},
            {'瓜', Final.Ua},
            {'香', Final.Yong},
            {'姜', Final.Yong},
            {'秋', Final.Iu},
            {'周', Final.Iu},
            {'山', Final.Ang},
            {'干', Final.Ang},
            {'開', Final.Ai},
            {'开', Final.Ai},
            {'哉', Final.Ai},
            {'嘉', Final.A},
            {'佳', Final.A},
            {'賓', Final.Ing},
            {'宾', Final.Ing},
            {'京', Final.Ing},
            {'歡', Final.Uang},
            {'欢', Final.Uang},
            {'官', Final.Uang},
            {'歌', Final.O},
            {'高', Final.O},
            {'須', Final.Y},
            {'须', Final.Y},
            {'車', Final.Y},
            {'车', Final.Y},
            {'杯', Final.Uoi},
            {'盃', Final.Uoi},
            {'孤', Final.U},
            {'姑', Final.U},
            {'燈', Final.Eing},
            {'灯', Final.Eing},
            {'庚', Final.Eing},
            {'光', Final.Uong},
            {'輝', Final.Ui},
            {'辉', Final.Ui},
            {'龜', Final.Ui},
            {'龟', Final.Ui},
            {'燒', Final.Ieu},
            {'烧', Final.Ieu},
            {'嬌', Final.Ieu},
            {'娇', Final.Ieu},
            {'銀', Final.Yng},
            {'银', Final.Yng},
            {'恭', Final.Yng},
            {'釭', Final.Ong},
            {'綱', Final.Ong},
            {'纲', Final.Ong},
            {'之', Final.I},
            {'箕', Final.I},
            {'東', Final.Oeng},
            {'东', Final.Oeng},
            {'江', Final.Oeng},
            {'郊', Final.Au},
            {'交', Final.Au},
            {'過', Final.Uo},
            {'过', Final.Uo},
            {'朱', Final.Uo},
            {'西', Final.E},
            {'街', Final.E},
            {'橋', Final.Io},
            {'桥', Final.Io},
            {'嬝', Final.Io},
            {'袅', Final.Io},
            {'雞', Final.Ie},
            {'鸡', Final.Ie},
            {'圭', Final.Ie},
            {'聲', Final.Iang},
            {'声', Final.Iang},
            {'正', Final.Iang},
            {'催', Final.Oey},
            {'初', Final.Oe},
            {'梳', Final.Oe},
            {'天', Final.Ieng},
            {'堅', Final.Ieng},
            {'坚', Final.Ieng},
            {'奇', Final.Ia},
            {'迦', Final.Ia},
            {'歪', Final.Uai},
            {'乖', Final.Uai},
            {'溝', Final.Eu},
            {'沟', Final.Eu},
            {'勾', Final.Eu},
            };

        private static readonly IDictionary<string, Tone> StringToTone =
            new Dictionary<string, Tone>(){
             {"上平", Tone.UpLevel},
            {"上上", Tone.UpUp},
            {"上去", Tone.UpFalling},
            {"上入", Tone.UpAbrupt},
            {"下平", Tone.DownLevel},
            // 下上调无字
            {"下去", Tone.DownFalling},
            {"下入", Tone.DownAbrupt}};

        private readonly string _outputFolder;
        private readonly string _cikLinCsvFile;
        private readonly string _newCikLingCsvFile;
        private readonly HanziVariantsUtil _hanziVariantsUtil;

        public CikLingLoader(string cikLinCsvFile,
                             string newCikLingCsvFile,
                             string outputFolder,
                             HanziVariantsUtil hanziVariantsUtil)
        {
            _cikLinCsvFile = cikLinCsvFile;
            _newCikLingCsvFile = newCikLingCsvFile;
            _outputFolder = outputFolder;
            _hanziVariantsUtil = hanziVariantsUtil;
        }

        public IEnumerable<Document> Run()
        {
            var jsonOutput = new List<string>();
            var documents = new List<Document>();

            IEnumerable<CikLinRow> cikLinRows;
            // load only3km's CikLinBekin
            using (var reader = new StreamReader(_cikLinCsvFile))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                cikLinRows = csv.GetRecords<CikLinRow>().ToList();
            }

            // Load new cikling.csv
            using (var reader = new StreamReader(_newCikLingCsvFile))
            {
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    foreach (var r in csv.GetRecords<NewCikLingRow>())
                    {
                        var final = GetFinal(r);
                        if (!final.HasValue)
                        {
                            Console.WriteLine($"Skipping {r.Id}, unknown Final: {r.FinalCik}{r.FinalLing}");
                            continue;
                        }
                        var initial = GetInitial(r);
                        var document = new Document
                        {
                            HanziCanonical = StringToHanziProto(r.Hanzi),
                            Initial = GetInitial(r),
                            Final = final.Value,
                            Tone = StringToTone[r.Tone],
                            Ciklin = new CikLinSourceInfo()
                            {
                                ExplanationCik = CleanExplanation(r.ExplanationCik),
                                ExplanationLing = CleanExplanation(r.ExplanationLing)
                            }
                        };
                        var oldRow = cikLinRows.SingleOrDefault(row => row.Id == r.Id);
                        document.Buc = ToBucString(document.Initial, document.Final, document.Tone);
                        if (!string.IsNullOrEmpty(oldRow?.HanziEquiv))
                        {
                            document.HanziAlternatives.Add(StringToHanziProto(oldRow.HanziEquiv));
                        }
                        if (!string.IsNullOrEmpty(oldRow?.HanziAlt))
                        {
                            document.HanziAlternatives.Add(StringToHanziProto(oldRow.HanziAlt));
                        }
                        AddFanoutHanzi(document);

                        documents.Add(document);
                        jsonOutput.Add(document.ToString());
                    }
                }
            }
            File.WriteAllLines(Path.Combine(_outputFolder, "ciklin_index_debug.txt"), jsonOutput);
            return documents;
        }

        private static Final? GetFinal(NewCikLingRow row)
        {
            if (!string.IsNullOrEmpty(row.FinalCik) && CharToFinal.ContainsKey(row.FinalCik[0]))
            {
                return CharToFinal[row.FinalCik[0]];
            }
            if (!string.IsNullOrEmpty(row.FinalLing) && CharToFinal.ContainsKey(row.FinalLing[0]))
            {
                return CharToFinal[row.FinalLing[0]];
            }
            return null;
        }

        private static Initial GetInitial(NewCikLingRow row)
        {
            if (!string.IsNullOrEmpty(row.InitialCik) && CharToInitial.ContainsKey(row.InitialCik[0]))
            {
                return CharToInitial[row.InitialCik[0]];
            }
            return CharToInitial[row.InitialLing[0]];
        }

        private static string CleanExplanation(string ex)
        {
            return Regex.Replace(ex.Trim(), @"\d+", "");
        }

        private void AddFanoutHanzi(Document d)
        {
            var allHanziList = new List<string>();
            allHanziList.Add(HanziToString(d.HanziCanonical));
            allHanziList.AddRange(d.HanziAlternatives.Select(h => HanziToString(h)).ToList());
            var fanOutHanziList = _hanziVariantsUtil.GetFanoutVariants(allHanziList.ToArray());
            d.HanziMatchable.Add(fanOutHanziList);
        }

    }

    // Volunteer contributed explanations
    sealed class NewCikLingRow
    {
        [Index(0)]
        public string Id { get; set; }

        [Index(1)]
        public string FinalCik { get; set; }

        [Index(2)]
        public string FinalLing { get; set; }

        [Index(3)]
        public string InitialCik { get; set; }

        [Index(4)]
        public string InitialLing { get; set; }

        [Index(5)]
        public string Tone { get; set; }

        [Index(6)]
        public string Hanzi { get; set; }

        [Index(7)]
        public string ExplanationCik { get; set; }

        [Index(8)]
        public string ExplanationLing { get; set; }

    }

    // only3km's CikLinBekin.csv
    sealed class CikLinRow
    {
        [Index(0)]
        public string Id
        {
            get;
            set;
        }

        [Index(1)]
        public string Hanzi
        {
            get;
            set;
        }

        [Index(2)]
        public string HanziEquiv
        {
            get;
            set;
        }

        [Index(3)]
        public string HanziAlt
        {
            get;
            set;
        }

        [Index(4)]
        public string Initial
        {
            get;
            set;
        }

        [Index(5)]
        public string Final
        {
            get;
            set;
        }

        [Index(6)]
        public int Tone
        {
            get;
            set;
        }
    }
}
