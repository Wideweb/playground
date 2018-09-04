using System.Threading.Tasks;

namespace Shop.Services
{
    public static class Folder
    {
        public const string Dictionary = "Dictionary";
    }

    public interface IFileManager
    {

        Task<byte[]> Get(string directory, string fileName);
        Task<string> Save(byte[] file, string directory = null, string fileName = null);
    }
}
