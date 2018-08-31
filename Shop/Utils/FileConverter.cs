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

        public static string ToBase64String(string input)
        {
            byte[] toEncodeAsBytes = System.Text.Encoding.ASCII.GetBytes(input);
            string returnValue = Convert.ToBase64String(toEncodeAsBytes);

            return returnValue;
        }
    }
}