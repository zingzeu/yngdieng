extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Yngdieng.Protos;
using Yngdieng.Common;
using System.Net.Http;
using System.Text;
using ZingzeuData.Parser;
using ZingzeuData.Models;
using Google.Protobuf;

namespace Yngdieng.Indexer
{
    public sealed class CreateFengDocumentsAction
    {

        private static readonly string OpenCCDaemon = "http://localhost:8081";
        private static readonly HttpClient client = new HttpClient();
        private readonly string mergedPath;
        private readonly string outputFolder;

        public CreateFengDocumentsAction(string mergedPath, string outputFolder)
        {
            this.mergedPath = mergedPath;
            this.outputFolder = outputFolder;
        }

        public IEnumerable<FengDocument> Run()
        {
            var jsonOutput = new List<string>();
            var documents = new List<FengDocument>();

            var docs =
                zingzeudata.ZingzeuData.Parser.ParseFeng.LoadFengRows(mergedPath).Select(f => {
                    var cleanExplanation =
                        zingzeudata.ZingzeuData.Shared.StringHelpers.ReplaceAllBraces(
                            f.ExplanationRaw);
                    var tmp = new FengDocument{
                        Id = $"p{f.PageNumber}_{f.LineNumber}",
                        HanziCanonical = f.HanziClean,
                        YngpingCanonical = f.Pron,
                        Explanation = cleanExplanation,
                        ExplanationHans = Simplify(cleanExplanation),
                        ExplanationStructured = SafeParseExplanation(cleanExplanation),
                        Source = new FengDocument.Types.SourceInfo{PageNumber = f.PageNumber,
                                                                   LineNumber = f.LineNumber},
                    };
                    tmp.HanziMatchable.Add(f.HanziClean);
                    tmp.HanziMatchable.Add(Simplify(f.HanziClean));
                    tmp.YngpingPermutations.Add(f.Pron);
                    tmp.YngpingPermutations.AddRange(
                        YngpingVariantsUtil.GenerateYngpingVariants(f.Pron));
                    return tmp;
                });

            documents.AddRange(docs);
            jsonOutput.AddRange(docs.Select(proto => proto.ToString()));
            File.WriteAllLines(Path.Combine(outputFolder, "feng_index_debug.txt"), jsonOutput);
            return documents;
        }

        private static string Simplify(string traditional)
        {
            return client
                .PostAsync(OpenCCDaemon, new ByteArrayContent(Encoding.UTF8.GetBytes(traditional)))
                .Result.Content.ReadAsStringAsync()
                .Result;
        }

        private static Explanation SafeParseExplanation(string rawExplanation)
        {
            try
            {
                return ConvertExplanation(FengExplanationParser.Parse(rawExplanation));
            }
            catch (Exception e)
            {
                Console.WriteLine($"{e.Message} {e.StackTrace}");
                return null;
            }
        }

        private static Explanation ConvertExplanation(
            zingzeudata.ZingzeuData.Models.Explanation explanation)
        {
            return Explanation.Parser.ParseFrom(explanation.ToByteArray());
        }
    }

}
