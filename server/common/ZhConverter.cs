using System;
using Grpc.Core;
using Yngdieng.OpenCC;
using Yngdieng.Protos;

namespace Yngdieng.Common
{
    public sealed class ZhConverter
    {
        private readonly YngdiengOpenCcClient _openCc;
        private readonly ZhConversionPreference _zhConversionPreference;

        public ZhConverter(YngdiengOpenCcClient openCc, ZhConversionPreference zhConversionPreference)
        {
            _openCc = openCc;
            _zhConversionPreference = zhConversionPreference;
        }

        public string tH(string hukziuText)
        {
            return hukziuText;
        }

        public string tM(string mandarinText)
        {
            switch (_zhConversionPreference)
            {
                case ZhConversionPreference.LangaugePreferenceHans:
                    return _openCc.SimplifyMandarinText(mandarinText);
                default:
                    return mandarinText;
            }
        }
    }

}
