using System;
using System.Collections.Generic;
using Yngdieng.Frontend.V3.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public static class AudioResources
    {
        public static AudioResource WithAudioClip(string fileName)
        {
            return AudioResourceWithRemoteUrls(new string[] { GetOssUrl(fileName) });
        }

        public static AudioResource WithTtsUrls(string yngping)
        {
            return AudioResourceWithRemoteUrls(new string[] {
                    GetTtsUrl(yngping)+".mp3",
                    GetTtsUrl(yngping)+".wav",
                }
            );
        }

        private static AudioResource AudioResourceWithRemoteUrls(IEnumerable<string> urls)
        {
            return new AudioResource
            {
                RemoteUrls = new AudioResource.Types.RemoteUrls
                {
                    RemoteUrls_ = {
                        urls
                    }
                }
            };
        }

        private static string GetTtsUrl(string yngping)
        {
            return "https://api.ydict.net/tts/" + Uri.EscapeDataString(yngping);
        }

        private static string GetOssUrl(string fileName)
        {
            return "https://yngdieng-media.oss-cn-hangzhou.aliyuncs.com/" + fileName;
        }
    }
}
