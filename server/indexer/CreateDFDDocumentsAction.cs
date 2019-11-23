using System;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using Yngdieng.Protos;
using System.IO;
using System.Collections.Generic;
using static Yngdieng.Common.HanziUtils;
using static Yngdieng.Common.FoochowRomanziedUtils;

namespace Yngdieng.Indexer
{
    public sealed class CreateDFDDocumentsAction
    {

        private readonly string _outputFolder;
        private readonly string _dfdCharactersFile;

        public CreateDFDDocumentsAction(string dfdCharactersFile, string outputFolder)
        {
            _dfdCharactersFile = dfdCharactersFile;
            _outputFolder = outputFolder;
        }

        public IEnumerable<Document> Run()
        {
            var jsonOutput = new List<string>();
            var documents = new List<Document>();
            int id = 0;
            using (var reader = new StreamReader(_dfdCharactersFile))
            {
                using (var csv = new CsvReader(reader))
                {
                    var records = csv.GetRecords<DFDRow>();
                    foreach (var r in records)
                    {
                        try
                        {
                            (var sInitial, var sFinal, var sTone) = Parse(r.Buc);
                            var document = new Document
                            {
                                DfdId = ++id,
                                HanziCanonical = StringToHanziProto(r.Hanzi),
                                Initial = sInitial,
                                Final = sFinal,
                                Tone = sTone,
                                Buc = r.Buc,
                                Dfd = new Document.Types.DFDSourceInfo()
                                {
                                    PageNumber = r.PageNumber,
                                    ColumnNumber = r.ColumnNumber,
                                    LineNumber = r.LineNumber,
                                    RadicalId = r.RadicalId
                                }
                            };
                            if (r.HanziAlt.Length > 0)
                            {
                                document.HanziAlternatives.Add(StringToHanziProto(r.HanziAlt));
                            }
                            documents.Add(document);
                            jsonOutput.Add(document.ToString());
                        }
                        catch (Exception)
                        {
                            Console.WriteLine($"Skipping {r.Id} {r.Hanzi}");
                            continue;
                        }

                    }
                }
            }
            File.WriteAllLines(Path.Combine(_outputFolder, "dfd_index_debug.txt"), jsonOutput);
            return documents;
        }

    }

    sealed class DFDRow
    {
        [Index(0)]
        public int Id { get; set; }

        [Index(1)]
        public string Hanzi { get; set; }

        [Index(2)]
        public string HanziAlt { get; set; }

        [Index(3)]
        public string Buc { get; set; }

        [Index(4)]
        public string Buc2 { get; set; }

        [Index(5)]
        public int PageNumber { get; set; }

        [Index(6)]
        public int ColumnNumber { get; set; }

        [Index(7)]
        public int LineNumber { get; set; }

        [Index(8)]
        public int RadicalId { get; set; }

        [Index(9)]
        public string Remarks { get; set; }
    }
}