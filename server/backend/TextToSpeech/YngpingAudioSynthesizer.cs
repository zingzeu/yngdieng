using System;
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
            var audioCodes = YngpingTtsUtil.YngpingToAudioCodes(yngping);
            if (audioCodes == null)
            {
                return null;
            }
            var audioFiles =
                audioCodes.Select(code => Path.Combine(this.ttsAudioFolder, code + ".wav"))
                    .ToArray();
            return TrimAudio(audioFiles);
        }

        private static byte[] TrimAudio(string[] inputList, int minLenMs = 700, int maxLenMs = 900)
        {
            WaveFormat inputFormat;
            using (WaveFileReader reader = new WaveFileReader(inputList[0]))
            {
                inputFormat = reader.WaveFormat;
            }
            using (MemoryStream outStream = new MemoryStream())
            using (WaveFileWriter writer = new WaveFileWriter(outStream, inputFormat))
            {

                byte[] sample = new byte[2];
                int startBytes = 0, endBytes = 0, startPos = 0, endPos = 0;
                foreach (string inputPath in inputList)
                {
                    using (WaveFileReader reader = new WaveFileReader(inputPath))
                    {
                        long bytesPerSample = reader.WaveFormat.BitsPerSample / 8;
                        int bytesPerMillisecond = reader.WaveFormat.AverageBytesPerSecond / 1000;
                        // 2 because we are dealing with 2-channel audio
                        if (bytesPerSample != 2)
                        {
                            throw new InvalidOperationException(
                                String.Format("bytesPerSample is assumed to be 2 but in {0} it is {1}",
                                inputPath, bytesPerSample));
                        }
                        long dataLength = reader.Length;
                        byte[] buffer = new byte[dataLength];
                        int bytesRead = reader.Read(buffer, 0, (int)dataLength);
                        int threshold = 0;
                        for (int i = 0; i + 2 <= dataLength; i += 2)
                        {
                            sample[0] = buffer[i];
                            sample[1] = buffer[i + 1];
                            ushort val = BitConverter.ToUInt16(sample);
                            if (val > threshold)
                            {
                                startBytes = i;
                                break;
                            }
                        }
                        for (int i = (int)dataLength - 2; i >= 0; i -= 2)
                        {
                            sample[0] = buffer[i];
                            sample[1] = buffer[i + 1];
                            ushort val = BitConverter.ToUInt16(sample);
                            if (val > threshold)
                            {
                                endBytes = i;
                                break;
                            }
                        }
                        startPos = startBytes - startBytes % reader.WaveFormat.BlockAlign;
                        endPos = (int)reader.Length - (endBytes - endBytes % reader.WaveFormat.BlockAlign);
                        endPos = Math.Min(endPos, maxLenMs * bytesPerMillisecond);
                        endPos = Math.Max(endPos, minLenMs * bytesPerMillisecond);
                        TrimWavFile(reader, writer, startPos, endPos);
                    }
                }
                return outStream.ToArray();
            }
        }

        private static void TrimWavFile(WaveFileReader reader,
                                        WaveFileWriter writer,
                                        int startPos,
                                        int endPos)
        {
            reader.Position = startPos;
            byte[] writeBuffer = new byte[1024];
            long position = reader.Position;
            while (position < endPos)
            {
                int bytesRequired = (int)(endPos - position);
                if (bytesRequired > 0)
                {
                    int bytesToRead = Math.Min(bytesRequired, writeBuffer.Length);
                    int bytesRead = reader.Read(writeBuffer, 0, bytesToRead);
                    if (bytesRead > 0)
                    {
                        writer.Write(writeBuffer, 0, bytesRead);
                        position = reader.Position;
                    }
                    else
                    {
                        // We have overrun the original audio. Fill remaining duration with silence.
                        writer.Write(new byte[bytesToRead], 0, bytesToRead);
                        position += bytesToRead;
                    }
                }
            }
        }
    }

}
