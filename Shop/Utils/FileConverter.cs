using System;

namespace Shop.Utils
{
    public static class FileConverter
    {
        public static byte[] FromBase64String(string file)
        {
            string body = file.Split(',')[1];
            return Convert.FromBase64String(body);
        }

        public static string ToBase64String(byte[] input)
        {
            return "data:image/png;base64, " + Convert.ToBase64String(input);
        }
    }
}