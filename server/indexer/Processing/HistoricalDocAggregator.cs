using System;
using System.Collections.Generic;
using Yngdieng.Protos;
using Yngdieng.Common;
using Google.Protobuf;
using System.Linq;
using Microsoft.AspNetCore.WebUtilities;
using LibHokchew.Shared;

namespace Yngdieng.Indexer.Processing
{
    /// <summary>
    /// 将戚林和DFD中具有相同字和音的条目合并成一条.
    /// </summary>
    public sealed class HistoricalDocAggregator
    {
        public HistoricalDocAggregator()
        {
        }

        private readonly IDictionary<string, HistoricalDocument> documents =
            new Dictionary<string, HistoricalDocument>();

        public void Add(Document d)
        {
            var key = Base64UrlTextEncoder.Encode(
                new DocumentAggregateKey
                {
                    HanziCanonical = d.HanziCanonical,
                    Initial = d.Initial,
                    Final = d.Final,
                    Tone = d.Tone
                }
                    .ToByteArray());

            if (!documents.ContainsKey(key))
            {
                documents[key] = new HistoricalDocument() { Id = key };
            }
            documents[key].Initial = d.Initial;
            documents[key].Final = d.Final;
            documents[key].Tone = d.Tone;
            documents[key].HanziCanonical = d.HanziCanonical;
            documents[key].Buc = d.Buc;
            documents[key].Yngping = YngpingBekinUtil.FanqieToYngping(d.Initial, d.Final, d.Tone);
            documents[key].YngpingModern = 
              CikLingUtil.ToYngPingHokchew(GetInitial(d.Initial), GetFinal(d.Final),GetTone(d.Tone));

            var altA = documents[key].HanziAlternatives;
            var altB = d.HanziAlternatives;
            var altMerged = altA.Union(altB).Distinct().ToList();
            documents[key].HanziAlternatives.Clear();
            documents[key].HanziAlternatives.AddRange(altMerged);

            var mA = documents[key].HanziMatchable;
            var mB = d.HanziMatchable;
            var mMerged = mA.Union(mB).Distinct().ToList();
            documents[key].HanziMatchable.Clear();
            documents[key].HanziMatchable.AddRange(mMerged);

            if (d.SourceInfoCase == Document.SourceInfoOneofCase.Ciklin)
            {
                documents[key].CiklinSource = d.Ciklin;
            }

            if (d.SourceInfoCase == Document.SourceInfoOneofCase.Dfd)
            {
                documents[key].DfdSource = d.Dfd;
            }
        }

        public IEnumerable<HistoricalDocument> GetHistoricalDocuments()
        {
            return documents.Values;
        }

        public static LibHokchew.Protos.Initial GetInitial(Yngdieng.Protos.Initial initial)
        {
            switch (initial)
            {
                case Yngdieng.Protos.Initial.B:
                    return LibHokchew.Protos.Initial.B;
                case Yngdieng.Protos.Initial.C:
                    return LibHokchew.Protos.Initial.C;
                case Yngdieng.Protos.Initial.D:
                    return LibHokchew.Protos.Initial.D;
                case Yngdieng.Protos.Initial.G:
                    return LibHokchew.Protos.Initial.G;
                case Yngdieng.Protos.Initial.H:
                    return LibHokchew.Protos.Initial.H;
                case Yngdieng.Protos.Initial.K:
                    return LibHokchew.Protos.Initial.K;
                case Yngdieng.Protos.Initial.L:
                    return LibHokchew.Protos.Initial.L;
                case Yngdieng.Protos.Initial.M:
                    return LibHokchew.Protos.Initial.M;
                case Yngdieng.Protos.Initial.N:
                    return LibHokchew.Protos.Initial.N;
                case Yngdieng.Protos.Initial.Ng:
                    return LibHokchew.Protos.Initial.Ng;
                case Yngdieng.Protos.Initial.None:
                    return LibHokchew.Protos.Initial.None;
                case Yngdieng.Protos.Initial.P:
                    return LibHokchew.Protos.Initial.P;
                case Yngdieng.Protos.Initial.S:
                    return LibHokchew.Protos.Initial.S;
                case Yngdieng.Protos.Initial.T:
                    return LibHokchew.Protos.Initial.T;
                case Yngdieng.Protos.Initial.Unspecified:
                    return LibHokchew.Protos.Initial.Unspecified;
                case Yngdieng.Protos.Initial.Z:
                    return LibHokchew.Protos.Initial.Z;
                default:
                    throw new Exception();
            }
        }

        public static LibHokchew.Protos.Final GetFinal(Yngdieng.Protos.Final final)
        {
            switch (final)
            {
                case Yngdieng.Protos.Final.A:
                    return LibHokchew.Protos.Final.A;
                case Yngdieng.Protos.Final.Ai:
                    return LibHokchew.Protos.Final.Ai;
                case Yngdieng.Protos.Final.Ang:
                    return LibHokchew.Protos.Final.Ang;
                case Yngdieng.Protos.Final.Au:
                    return LibHokchew.Protos.Final.Au;
                case Yngdieng.Protos.Final.E:
                    return LibHokchew.Protos.Final.E;
                case Yngdieng.Protos.Final.Eing:
                    return LibHokchew.Protos.Final.Eing;
                case Yngdieng.Protos.Final.Eu:
                    return LibHokchew.Protos.Final.Eu;
                case Yngdieng.Protos.Final.I:
                    return LibHokchew.Protos.Final.I;
                case Yngdieng.Protos.Final.Ia:
                    return LibHokchew.Protos.Final.Ia;
                case Yngdieng.Protos.Final.Iang:
                    return LibHokchew.Protos.Final.Iang;
                case Yngdieng.Protos.Final.Ie:
                    return LibHokchew.Protos.Final.Ie;
                case Yngdieng.Protos.Final.Ieng:
                    return LibHokchew.Protos.Final.Ieng;
                case Yngdieng.Protos.Final.Ieu:
                    return LibHokchew.Protos.Final.Ieu;
                case Yngdieng.Protos.Final.Ing:
                    return LibHokchew.Protos.Final.Ing;
                case Yngdieng.Protos.Final.Io:
                    return LibHokchew.Protos.Final.Io;
                case Yngdieng.Protos.Final.Iu:
                    return LibHokchew.Protos.Final.Iu;
                case Yngdieng.Protos.Final.O:
                    return LibHokchew.Protos.Final.O;
                case Yngdieng.Protos.Final.Oe:
                    return LibHokchew.Protos.Final.Oe;
                case Yngdieng.Protos.Final.Oeng:
                    return LibHokchew.Protos.Final.Oeng;
                case Yngdieng.Protos.Final.Oey:
                    return LibHokchew.Protos.Final.Oey;
                case Yngdieng.Protos.Final.Ong:
                    return LibHokchew.Protos.Final.Ong;
                case Yngdieng.Protos.Final.U:
                    return LibHokchew.Protos.Final.U;
                case Yngdieng.Protos.Final.Ua:
                    return LibHokchew.Protos.Final.Ua;
                case Yngdieng.Protos.Final.Uai:
                    return LibHokchew.Protos.Final.Uai;
                case Yngdieng.Protos.Final.Uang:
                    return LibHokchew.Protos.Final.Uang;
                case Yngdieng.Protos.Final.Ui:
                    return LibHokchew.Protos.Final.Ui;
                case Yngdieng.Protos.Final.Ung:
                    return LibHokchew.Protos.Final.Ung;
                case Yngdieng.Protos.Final.Unspecified:
                    return LibHokchew.Protos.Final.Unspecified;
                case Yngdieng.Protos.Final.Uo:
                    return LibHokchew.Protos.Final.Uo;
                case Yngdieng.Protos.Final.Uoi:
                    return LibHokchew.Protos.Final.Uoi;
                case Yngdieng.Protos.Final.Uong:
                    return LibHokchew.Protos.Final.Uong;
                case Yngdieng.Protos.Final.Y:
                    return LibHokchew.Protos.Final.Y;
                case Yngdieng.Protos.Final.Yng:
                    return LibHokchew.Protos.Final.Yng;
                case Yngdieng.Protos.Final.Yong:
                    return LibHokchew.Protos.Final.Yong;
                default:
                    throw new Exception($"Unknown final {final}");
            }
        }

        public static LibHokchew.Protos.Tone GetTone(Yngdieng.Protos.Tone tone)
        {
            switch (tone)
            {
                case Yngdieng.Protos.Tone.DownAbrupt:
                    return LibHokchew.Protos.Tone.DownAbrupt;
                case Yngdieng.Protos.Tone.DownFalling:
                    return LibHokchew.Protos.Tone.DownFalling;
                case Yngdieng.Protos.Tone.DownLevel:
                    return LibHokchew.Protos.Tone.DownLevel;
                case Yngdieng.Protos.Tone.Unspecified:
                    return LibHokchew.Protos.Tone.Unspecified;
                case Yngdieng.Protos.Tone.UpAbrupt:
                    return LibHokchew.Protos.Tone.UpAbrupt;
                case Yngdieng.Protos.Tone.UpFalling:
                    return LibHokchew.Protos.Tone.UpFalling;
                case Yngdieng.Protos.Tone.UpLevel:
                    return LibHokchew.Protos.Tone.UpLevel;
                case Yngdieng.Protos.Tone.UpUp:
                    return LibHokchew.Protos.Tone.UpUp;
                default:
                    throw new Exception();
            }
        }
    }
}
