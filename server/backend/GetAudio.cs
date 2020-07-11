using System;
using System.IO;
// using Newtonsoft.Json;
using System.Collections.Generic;
using NAudio.Wave;

namespace Yngdieng.Backend
{
    public static class GetAudio
    {
        private static Dictionary<string, string> ConsonantAudioMapping =
            new Dictionary<string, string>{
                {"b", "01"},
                {"p", "02"},
                {"m", "03"},
                {"d", "04"},
                {"t", "05"},
                {"n", "07"},
                {"l", "06"},
                {"z", "08"},
                {"c", "09"},
                {"s", "10"},
                {"g", "11"},
                {"k", "12"},
                {"ng", "14"},
                {"", "15"},
                {"h", "13"},
                {"w", "03"}, // as m
                {"j", "08"}, // as z
                {"nj", "07"} // as n
            };

        private static Dictionary<string, string> ToneAudioMapping =
            new Dictionary<string, string>(){
                {"55", "01"},  // 陰平
                {"33", "02"},  // 上聲
                {"213", "03"}, // 陰去
                {"24", "04"},  // 陰入
                {"53", "05"},  // 陽平
                {"242", "07"}, // 陽去
                {"5", "08"},   // 陽入
                // {"21", "03"},    // 半陰去
                // {"24","07"}    // 半陽去
            };

        private static Dictionary<string, string[]> FinalAudioMapping =
            new Dictionary<string, string[]>{{"01", new string[]{"ung", "oung"}},
                                             {"02", new string[]{"ua"}},
                                             {"03", new string[]{"io"}},
                                             {"04", new string[]{"iu"}},
                                             {"05", new string[]{"ang"}},
                                             {"06", new string[]{"ai"}},
                                             {"07", new string[]{"a"}},
                                             {"08", new string[]{"ing", "eing"}},
                                             {"09", new string[]{"uang"}},
                                             {"10", new string[]{"o", "oo"}},
                                             {"11", new string[]{"y", "eoy"}},
                                             {"13", new string[]{"ui"}},
                                             {"14", new string[]{"u", "ou"}},
                                             {"15", new string[]{"eing", "aing"}},
                                             {"16", new string[]{"uong"}},
                                             {"19", new string[]{"yng", "eoyng"}},
                                             {"20", new string[]{"oung", "aung"}},
                                             {"21", new string[]{"i", "ei"}},
                                             {"22", new string[]{"eoyng", "ooyng"}},
                                             {"23", new string[]{"au"}},
                                             {"24", new string[]{"uo"}},
                                             {"25", new string[]{"e"}},
                                             {"26", new string[]{"yo"}},
                                             {"27", new string[]{"ie"}},
                                             {"28", new string[]{"iang"}},
                                             {"29", new string[]{"eoy", "ooy"}},
                                             {"30", new string[]{"eo"}},
                                             {"31", new string[]{"ieng"}},
                                             {"32", new string[]{"ia"}},
                                             {"34", new string[]{"uai"}},
                                             {"36", new string[]{"eu"}}};

        private static HashSet<string> WeirdTones = new HashSet<string>{"03", "04", "07"};

        private static void ParseFinal(string _final, out string _rime, out string _coda)
        {
            string[] rimeList =
                new string[]{"a",
                             "ia",
                             "ua",
                             "uai",
                             "ai",
                             "au",
                             "o",
                             "oo",
                             "yo",
                             "uo",
                             "eoy",
                             "ooy",
                             "eo",
                             "oo",
                             "e",
                             "ie",
                             "eu",
                             "i",
                             "ei",
                             "iu",
                             "u",
                             "ou",
                             "ui",
                             "y",
                             "eoy",
                             "oou",
                             // 例外 https://github.com/ztl8702/yngping-rime/issues/68
                             "iau"};

            // FIXME: skip sorting by writing the list in order.
            Array.Sort<string>(rimeList, new Comparison<string>((s1, s2) => s2.Length - s1.Length));

            _rime = _final;
            _coda = "";

            foreach (var r in rimeList)
            {
                if (_final.StartsWith(r))
                {
                    _rime = r;
                    _coda = _final.Substring(r.Length, _final.Length - r.Length);
                    return;
                }
            }
        }

        // FIXME: Might need a thorough test.
        private static string FindFinal(string inputYp)
        {
            var(initial, final, tone) =
                ZingzeuData.Yngping.Yngping0_4_0Validator.TryParseHukziuSyllable(inputYp);

            string rime, coda;
            ParseFinal(final, out rime, out coda);
            string mappedTone = ToneAudioMapping[tone];
            foreach (var pair in FinalAudioMapping)
            {
                var prons = pair.Value;
                if (coda == "h" || coda == "k")
                {
                    if (WeirdTones.Contains(mappedTone))
                    {
                        if ((prons.Length == 2 && (prons[1] == rime || prons[1] == rime + "ng")) ||
                            (prons[0] == rime || prons[0] == rime + "ng"))
                        {
                            return pair.Key;
                        }
                    }
                    else if (prons[0] == rime || prons[0] == rime + "ng")
                    {
                        return pair.Key;
                    }
                }
                else if (WeirdTones.Contains(mappedTone) &&
                         ((prons.Length == 2 && prons[1] == final) ||
                          (prons.Length == 1 && prons[0] == final)))
                {
                    return pair.Key;
                }
                else if (prons[0] == final)
                {
                    return pair.Key;
                }
            }

            // FIXME: clean up comments
            // Console.WriteLine(initial);
            // Console.WriteLine(final);
            // Console.WriteLine(rime);
            // Console.WriteLine(coda);
            // Console.WriteLine(tone);
            return "";
        }

        public static string SyllableToAudio(string yngping)
        {
            string final = FindFinal(yngping);
            var(initial, _, tone) =
                ZingzeuData.Yngping.Yngping0_4_0Validator.TryParseHukziuSyllable(yngping);
            if (final == "")
            {
                Console.WriteLine("[debug]SyllableToAudio: Empty final");
                return "";
            }
            return ConsonantAudioMapping[initial] + final + ToneAudioMapping[tone];
        }

        private static string[] GetYngpingList(string yngping_input)
        {
            List<string> result = new List<string>();
            string cur = "";
            bool finished = true;
            foreach (char c in yngping_input)
            {
                if (cur == "")
                {
                    finished = false;
                }
                else if (c >= 'a' &&c <= 'z' &&finished = true)
                {
                    finished = false;
                    result.Add(cur);
                    cur = "";
                }
                else if (c >= '0' &&c <= '9' &&finished = false)
                {
                    finished = true;
                }
                cur += c;
            }
            result.Add(cur);
            return result.ToArray();
        }

        public static byte[] TrimSilence(string[] inputList, int msReserved = 0)
        {
            WaveFormat inputFormat;
            using (WaveFileReader reader = new WaveFileReader(inputList[0]))
            {
                inputFormat = reader.WaveFormat;
            }

            MemoryStream outStream = new MemoryStream();
            using (WaveFileWriter writer = new WaveFileWriter(outStream, inputFormat))
            {
                byte[] buffer = new byte[1024];
                byte[] sample = new byte[2];

                ushort max = 0;
                int total = 0;
                bool starting = true, ending = false;
                int startBytes = 0, endBytes = 0, startPos = 0, endPos = 0;
                foreach (string inputPath in inputList)
                {

                    using (WaveFileReader reader = new WaveFileReader(inputPath))
                    {
                        // FIXME: clean up comments
                        // int bytesPerSample = reader.WaveFormat.BitsPerSample / 8;
                        // Assuming bytesPerSample == 2
                        int bytesPerMillisecond = reader.WaveFormat.AverageBytesPerSecond / 1000;

                        int bytesRead = reader.Read(buffer, 0, bytesPerMillisecond);
                        while (bytesRead > 0)
                        {
                            max = 0;
                            total = 0;
                            for (int i = 0; i + 2 <= bytesRead; i += 2)
                            {
                                sample[0] = buffer[i];
                                sample[1] = buffer[i + 1];
                                ushort val = BitConverter.ToUInt16(sample);
                                max = val > max ? val : max;
                                total += val;
                            }
                            int avg = total / bytesRead * 2;
                            // Console.Write($"{avg} ");
                            int threashold = 0;
                            if (avg <= threashold && starting)
                            {
                                startBytes += bytesRead;
                            }
                            else if (avg > threashold && starting)
                            {
                                starting = false;
                            }
                            else if (max <= threashold && !starting)
                            {
                                if (!ending)
                                {
                                    ending = true;
                                }
                                else
                                {
                                    endBytes += bytesRead;
                                }
                            }
                            else if (avg > threashold && ending)
                            {
                                ending = false;
                                endBytes = 0;
                            }
                            bytesRead = reader.Read(buffer, 0, bytesPerMillisecond);
                        }

                        // Console.WriteLine($"total milliseconds: {(int)reader.Length /
                        // bytesPerMillisecond}"); Console.WriteLine($"Milliseconds of silence from
                        // start: {startBytes / bytesPerMillisecond}");
                        // Console.WriteLine($"Milliseconds of silence till end: {endBytes /
                        // bytesPerMillisecond}");

                        startPos = 0;
                        endPos = (int)reader.Length;
                        if (startBytes > msReserved * bytesPerMillisecond)
                        {
                            startPos = startBytes - msReserved * bytesPerMillisecond;
                            startPos -= startPos % reader.WaveFormat.BlockAlign;
                            ;
                        }
                        if (endBytes > msReserved * bytesPerMillisecond)
                        {
                            endBytes = endBytes - msReserved * bytesPerMillisecond;
                            endBytes -= endBytes % reader.WaveFormat.BlockAlign;
                            endPos = (int)reader.Length - endBytes;
                        }
                        // Console.WriteLine($"start pos: {startPos / bytesPerMillisecond}");
                        // Console.WriteLine($"end pos: {endPos / bytesPerMillisecond}");

                        TrimWavFile(reader, writer, startPos, endPos);
                    }
                }
                return writer.ToArray();
            }
        }

        private static void TrimWavFile(WaveFileReader reader,
                                        WaveFileWriter writer,
                                        int startPos,
                                        int endPos)
        {
            reader.Position = startPos;
            byte[] writeBuffer = new byte[1024];
            while (reader.Position < endPos)
            {

                int bytesRequired = (int)(endPos - reader.Position);
                if (bytesRequired > 0)
                {
                    int bytesToRead = Math.Min(bytesRequired, writeBuffer.Length);
                    int bytesRead = reader.Read(writeBuffer, 0, bytesToRead);
                    if (bytesRead > 0)
                    {
                        writer.Write(writeBuffer, 0, bytesRead);
                    }
                }
            }
        }

        public static string ByteArrayToString(byte[] ba)
        {
            return BitConverter.ToString(ba).Replace("-", "");
        }

        public static byte[] GetWaveBinary(string yngping_in)
        {
            string[] yngpingList = GetYngpingList(yngping_in);
            List<string> audioList = new List<string>();
            foreach (string s in yngpingList)
            {
                string audio =
                    "../../src/assets/audio/" + SyllableToAudio(s) + ".wav" audioList.Add(audio);
            }
            return TrimSilence(audioList.ToArray());
        }
    }
}