extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using Google.Protobuf;
using Yngdieng.Common;
using Yngdieng.Protos;
using ZingzeuData.Models;
using ZingzeuData.Parser;
using static Yngdieng.Indexer.ExplanationUtil;

namespace Yngdieng.Indexer.Loading
{
    public sealed class FengLoader
    {

        private static readonly string OpenCCDaemon = "http://localhost:8081";
        private static readonly HttpClient client = new HttpClient();
        private readonly string fengPath;
        private readonly string fengZeuMappingPath;
        private readonly string outputFolder;

        public FengLoader(string fengPath, string fengZeuMappingPath, string outputFolder)
        {
            this.fengPath = fengPath;
            this.fengZeuMappingPath = fengZeuMappingPath;
            this.outputFolder = outputFolder;
        }

        public IEnumerable<FengDocument> Run()
        {
            var jsonOutput = new List<string>();
            var documents = new List<FengDocument>();
            var fengZeuMapping = LoadFengZeuMapping();
            var docs =
                zingzeudata.ZingzeuData.Parser.ParseFeng.LoadFengRows(fengPath).Select(f =>
                {
                    var cleanExplanation =
                        zingzeudata.ZingzeuData.Shared.StringHelpers.ReplaceAllBraces(
                            f.ExplanationRaw);
                    var structured = SafeParseExplanation(cleanExplanation);
                    var flattened = FlattenExplanation(structured);
                    var tmp = new FengDocument
                    {
                        Id = $"p{f.PageNumber}_{f.LineNumber}",
                        HanziCanonical = f.HanziClean,
                        YngpingCanonical = f.Pron,
                        YngpingUnderlying = f.PronUnderlying,
                        Explanation = cleanExplanation,
                        ExplanationTrad = flattened,
                        ExplanationHans = Simplify(flattened),
                        ExplanationStructured = structured,
                        Source = new FengDocument.Types.SourceInfo
                        {
                            PageNumber = f.PageNumber,
                            LineNumber = f.LineNumber
                        },
                    };
                    if (fengZeuMapping.ContainsKey((f.PageNumber, f.LineNumber)))
                    {
                        tmp.ZingzeuId = fengZeuMapping[(f.PageNumber, f.LineNumber)];
                    }
                    tmp.HanziMatchable.Add(f.HanziClean);
                    tmp.HanziMatchable.Add(Simplify(f.HanziClean));
                    tmp.YngpingPermutations.Add(f.Pron);
                    tmp.YngpingPermutations.Add(f.PronUnderlying);
                    tmp.YngpingPermutations.AddRange(
                        YngpingVariantsUtil.GenerateYngpingVariants(f.Pron));
                    return tmp;
                });

            documents.AddRange(docs);
            jsonOutput.AddRange(docs.Select(proto => proto.ToString()));
            File.WriteAllLines(Path.Combine(outputFolder, "feng_index_debug.txt"), jsonOutput);
            return documents;
        }

        private IReadOnlyDictionary<(int, int), string> LoadFengZeuMapping()
        {
            return zingzeudata.ZingzeuData.Parser.ParseFengZeuMapping
                .LoadFengZeuMapping(fengZeuMappingPath)
                .ToDictionary(e => (e.FengPageNumber, e.FengLineNumber), e => e.ZingzeuId);
        }

        private static string Simplify(string traditional)
        {
            return client
                .PostAsync(OpenCCDaemon, new ByteArrayContent(Encoding.UTF8.GetBytes(traditional)))
                .Result.Content.ReadAsStringAsync()
                .Result;
        }

    }

}
