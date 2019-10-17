using System;
using System.Collections.Generic;
using System.Text;

namespace BlockChainLambda
{
    public static class Extensions
    {
        public static string AddQueryToURL(this string URL, string name, string value)
        {
            string symbol;

            if (!URL.Contains("?"))
                symbol = "?";
            else
                symbol = "&";

            URL = $"{URL}{symbol}{name}={value}";

            return URL;
        }
    }
}
