using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;

namespace OpenCC
{
    // Adapted from https://blog.darkthread.net/blog/call-opencc-with-csharp/
    public sealed class OpenCcClient : IDisposable
    {

        public static readonly string ConfigS2T = "opencc_data/s2t.json";
        public static readonly string ConfigT2S = "opencc_data/t2s.json";

        private readonly IntPtr OpenCCInstance = IntPtr.Zero;

        public OpenCcClient(string configFile = "opencc_data/s2t.json")
        {
            OpenCCInstance = CInterface.opencc_open(FindConfigPath(configFile));
            if (OpenCCInstance.ToInt64() == 0)
            {
                throw new Exception($"Failed to initialize opencc");
            }
        }

        private static string FindConfigPath(string configPath)
        {
            if (File.Exists(configPath))
            {
                return configPath;
            }
            var includedDataPath = Path.Combine(GetExecutingAssemblyPath(), configPath);
            if (File.Exists(includedDataPath))
            {
                return includedDataPath;
            }
            throw new FileNotFoundException($"Cannot find {configPath}");
        }

        private static string GetExecutingAssemblyPath()
        {
            string codeBase = Assembly.GetExecutingAssembly().CodeBase;
            UriBuilder uri = new UriBuilder(codeBase);
            string path = Uri.UnescapeDataString(uri.Path);
            return Path.GetDirectoryName(path);
        }

        public string Convert(string text)
        {
            IntPtr inStr = NativeUtf8FromString(text);
            IntPtr outStr = CInterface.opencc_convert_utf8(OpenCCInstance.ToInt64(), inStr, -1);
            Marshal.FreeHGlobal(inStr);
            return StringFromNativeUtf8(outStr);
        }

        public void Dispose()
        {
            var result = CInterface.opencc_close(OpenCCInstance.ToInt64());
            if (result.ToInt64() != 0)
            {
                throw new Exception($"Non zero return value when calling opencc_close: {result.ToInt64()}");
            }
        }

        // https://stackoverflow.com/a/10773988/288936
        public static IntPtr NativeUtf8FromString(string managedString)
        {
            int len = Encoding.UTF8.GetByteCount(managedString);
            byte[] buffer = new byte[len + 1];
            Encoding.UTF8.GetBytes(managedString, 0, managedString.Length, buffer, 0);
            IntPtr nativeUtf8 = Marshal.AllocHGlobal(buffer.Length);
            Marshal.Copy(buffer, 0, nativeUtf8, buffer.Length);
            return nativeUtf8;
        }

        public static string StringFromNativeUtf8(IntPtr nativeUtf8)
        {
            int len = 0;
            while (Marshal.ReadByte(nativeUtf8, len) != 0) ++len;
            byte[] buffer = new byte[len];
            Marshal.Copy(nativeUtf8, buffer, 0, buffer.Length);
            CInterface.opencc_convert_utf8_free(nativeUtf8);
            return Encoding.UTF8.GetString(buffer);
        }

    }

    internal static class CInterface
    {
        [DllImport("libopencc.so.1.1.1", EntryPoint = "opencc_open")]
        internal static extern IntPtr opencc_open(string configFileName);

        [DllImport("libopencc.so.1.1.1", EntryPoint = "opencc_convert_utf8")]
        internal static extern IntPtr opencc_convert_utf8(Int64 opencc, IntPtr input, long length);

        [DllImport("libopencc.so.1.1.1", EntryPoint = "opencc_convert_utf8_free")]
        internal static extern void opencc_convert_utf8_free(IntPtr str);

        [DllImport("libopencc.so.1.1.1", EntryPoint = "opencc_close")]
        internal static extern IntPtr opencc_close(Int64 opencc);

    }

}
