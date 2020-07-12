using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NAudio.Wave;

namespace Yngdieng.Backend.TextToSpeech
{

    public sealed class YngpingAudioSynthesizer
    {
        private readonly IConfiguration config;
        private readonly ILogger<YngpingAudioSynthesizer> logger;

        private readonly string ttsAudioFolder;

        public YngpingAudioSynthesizer(IConfiguration config,
                                       ILogger<YngpingAudioSynthesizer> logger)
        {
            this.config = config;
            this.logger = logger;
            this.ttsAudioFolder = config["TtsAudioFolder"];
        }

        public byte[]? YngpingToAudio(string yngping)
        {
            var syllables = yngping.Split().Select(s => s.Trim().ToLowerInvariant());
            var audioCodes = syllables.Select(YngpingTtsUtil.SyllableToAudio);
            if (audioCodes.Any(a => string.IsNullOrEmpty(a)))
            {
                return null;
            }
            var audioFiles =
                audioCodes.Select(code => Path.Combine(this.ttsAudioFolder, code + ".wav"))
                    .ToArray();
            return TrimSilence(audioFiles);
        }

        private static byte[] TrimSilence(string[] inputList, int msReserved = 0)
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
                bool starting = true, ending = false;
                int startBytes = 0, endBytes = 0, startPos = 0, endPos = 0;
                foreach (string inputPath in inputList)
                {

                    using (WaveFileReader reader = new WaveFileReader(inputPath))
                    {
                        // int bytesPerSample = reader.WaveFormat.BitsPerSample / 8;
                        // Assuming bytesPerSample == 2
                        int bytesPerMillisecond = reader.WaveFormat.AverageBytesPerSecond / 1000;

                        int bytesRead = reader.Read(buffer, 0, bytesPerMillisecond);
                        while (bytesRead > 0)
                        {
                            max = 0;
                            for (int i = 0; i + 2 <= bytesRead; i += 2)
                            {
                                sample[0] = buffer[i];
                                sample[1] = buffer[i + 1];
                                ushort val = BitConverter.ToUInt16(sample);
                                max = val > max ? val : max;
                            }
                            int threashold = 0;
                            if (max <= threashold && starting)
                            {
                                startBytes += bytesRead;
                            }
                            else if (max > threashold && starting)
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
                            else if (max > threashold && ending)
                            {
                                ending = false;
                                endBytes = 0;
                            }
                            bytesRead = reader.Read(buffer, 0, bytesPerMillisecond);
                        }
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

                        TrimWavFile(reader, writer, startPos, endPos);
                    }
                }
            }
            return outStream.ToArray();
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
    }

}