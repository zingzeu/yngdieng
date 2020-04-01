using System;
using Yngdieng.Protos;

namespace Yngdieng.Common
{
  public static class YngpingBekinUtil
  {
    /// <summary>
    /// 八音转榕拼（戚林八音音系）。
    /// </summary>
    /// <returns></returns>
    public static string FanqieToYngping(Initial initial, Final final, Tone tone)
    {
      return GetInitialString(initial) + GetFinalString(final, tone) + GetToneNumber(tone);
    }

    private static string GetFinalString(Final final, Tone tone)
    {
      switch (tone)
      {
        case Tone.UpAbrupt:
        case Tone.DownAbrupt:
          switch (final)
          {
            case Final.A:
              return "ah";
            case Final.Ang:
              return "ak";
            case Final.Ia:
              return "iah";
            case Final.Iang:
              return "iak";
            case Final.Ua:
              return "uah";
            case Final.Uang:
              return "uak";
            case Final.O:
              return "oh";
            case Final.Ong:
              return "ok";
            case Final.Io:
              return "ioh";
            case Final.Yong:
              return "iok";
            case Final.Uo:
              return "uoh";
            case Final.Uong:
              return "uok";
            case Final.Oe:
              return "eoh";
            case Final.Oeng:
              return "eok";
            case Final.E:
              return "eh";
            case Final.Eing:
              return "ek";
            case Final.Ie:
              return "ieh";
            case Final.Ieng:
              return "iek";
            case Final.I:
              return "ih";
            case Final.Ing:
              return "ik";
            case Final.U:
              return "uh";
            case Final.Ung:
              return "uk";
            case Final.Y:
              return "yh";
            case Final.Yng:
              return "yk";
          }
          throw new ArgumentException("Not allowed");
        default:
          switch (final)
          {
            case Final.A:
              return "a";
            case Final.Ia:
              return "ia";
            case Final.Ua:
              return "ua";
            case Final.Uai:
              return "uai";
            case Final.Ai:
              return "ai";
            case Final.Au:
              return "au";
            case Final.O:
              return "o";
            case Final.Io:
              return "io";
            case Final.Uo:
              return "uo";
            case Final.Uoi:
              return "uoi";
            case Final.Oey:
              return "oi";
            case Final.Oe:
              return "eo";
            case Final.E:
              return "e";
            case Final.Ie:
              return "ie";
            case Final.Ieu:
              return "ieu";
            case Final.Eu:
              return "eu";
            case Final.I:
              return "i";
            case Final.Iu:
              return "iu";
            case Final.U:
              return "u";
            case Final.Ui:
              return "ui";
            case Final.Y:
              return "y";
            case Final.Ang:
              return "ang";
            case Final.Iang:
              return "iang";
            case Final.Uang:
              return "uang";
            case Final.Ong:
              return "ong";
            case Final.Yong:
              return "iong";
            case Final.Uong:
              return "uong";
            case Final.Oeng:
                return "eong";
            case Final.Eing:
              return "eng";
            case Final.Ieng:
              return "ieng";
            case Final.Ing:
              return "ing";
            case Final.Ung:
              return "ung";
            case Final.Yng:
              return "yng";
          }
          throw new ArgumentException("Not allowed");
      }
    }

    private static string GetInitialString(Initial initial)
    {
      switch (initial)
      {
        case Initial.L:
          return "l";
        case Initial.B:
          return "b";
        case Initial.G:
          return "g";
        case Initial.K:
          return "k";
        case Initial.D:
          return "d";
        case Initial.P:
          return "p";
        case Initial.T:
          return "t";
        case Initial.Z:
          return "z";
        case Initial.N:
          return "n";
        case Initial.S:
          return "s";
        case Initial.None:
          return "";
        case Initial.M:
          return "m";
        case Initial.Ng:
          return "ng";
        case Initial.C:
          return "c";
        case Initial.H:
          return "h";
      }
      throw new ArgumentException("Unknown initial");
    }

    private static string GetToneNumber(Tone tone)
    {
      switch (tone)
      {
        case Tone.UpLevel:
          return "1";
        case Tone.UpUp:
          return "2";
        case Tone.UpFalling:
          return "3";
        case Tone.UpAbrupt:
          return "4";
        case Tone.DownLevel:
          return "5";
        case Tone.DownFalling:
          return "7";
        case Tone.DownAbrupt:
          return "8";
      }
      throw new ArgumentException("Unexpected tone");
    }

  }
}
