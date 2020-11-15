namespace Yngdieng.Common
{
    public static class StringExt
    {
        public static int CountOccurences(this string x, string query)
        {
            var count = 0;
            for (var i = 0; i < x.Length; ++i)
            {
                if (x[i..^0].StartsWith(query))
                {
                    ++count;
                }
            }
            return count;
        }

        public static string Truncate(this string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) { return value; }

            if (value.Length > maxLength)
            {
                return value.Substring(0, maxLength - 3) + "...";
            }
            return value;
        }

        public static string OrElse(this string value, string alt)
        {
            if (string.IsNullOrEmpty(value))
            {
                return alt;
            }
            return value;
        }
    }
}
