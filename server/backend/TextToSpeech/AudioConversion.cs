using System;
using System.IO;
using System.Threading.Tasks;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Streams;
namespace Yngdieng.Backend.TextToSpeech
{
    public static class AudioConversion
    {

        public static async Task<byte[]> WavToMp3(byte[] wave)
        {
            // write .wav to disk
            string wavPath = Path.GetTempFileName();
            await File.WriteAllBytesAsync(wavPath, wave);
            string mp3Path = Path.ChangeExtension(wavPath, "mp3");
            var conversion = await FFmpeg.Conversions.FromSnippet.Transcode(
                inputFilePath: wavPath,
                outputFilePath: mp3Path,
             videoCodec: VideoCodec.copy,
                audioCodec: AudioCodec.mp3,
                 subtitleCodec: Xabe.FFmpeg.Streams.SubtitleStream.SubtitleCodec.copy,
                keepSubtitles: false);
            IConversionResult result = await conversion
                .Start();
            var mp3Bytes = await File.ReadAllBytesAsync(mp3Path);
            File.Delete(wavPath);
            File.Delete(mp3Path);
            return mp3Bytes;
        }
    }

}
