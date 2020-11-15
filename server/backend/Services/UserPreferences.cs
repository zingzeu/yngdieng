using System;
using Grpc.Core;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services
{

    public static class UserPreferences
    {

        public static readonly UserPreference Default = new UserPreference()
        {
            ZhConversionPreference = ZhConversionPreference.LangaugePreferenceHans
        };

        public static UserPreference FromContext(ServerCallContext context)
        {
            var base64Value = context.RequestHeaders.GetValue("x-ydict-options");
            if (base64Value == null)
            {
                return Default;
            }
            try
            {
                return UserPreference.Parser.ParseFrom(Convert.FromBase64String(base64Value));
            }
            catch
            {
                return Default;
            }
        }

    }
}
