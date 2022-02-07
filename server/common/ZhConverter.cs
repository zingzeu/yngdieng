using System;
using Grpc.Core;
using Yngdieng.OpenCC;
using Yngdieng.Protos;

namespace Yngdieng.Common
{
    public interface ZhConverter
    {
        public string tH(string hukziuText);
        public string tM(string mandarinText);
    }

    public sealed class OpenCcZhConverter : ZhConverter
    {
        private readonly YngdiengOpenCcClient _openCc;
        private readonly ZhConversionPreference _zhConversionPreference;

        public OpenCcZhConverter(YngdiengOpenCcClient openCc, ZhConversionPreference zhConversionPreference)
        {
            _openCc = openCc;
            _zhConversionPreference = zhConversionPreference;
        }

        public string tH(string hukziuText)
        {
            switch (_zhConversionPreference)
            {
                case ZhConversionPreference.LangaugePreferenceHans:
                    return _openCc.SimplifyHukziuText(hukziuText);
                default:
                    return hukziuText;
            }
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

    public sealed class NoOpZhConverter : ZhConverter
    {
        public string tH(string hukziuText)
        {
            return hukziuText;
        }

        public string tM(string mandarinText)
        {
            return mandarinText;
        }
    }

}
