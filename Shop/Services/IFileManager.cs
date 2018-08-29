using System.Threading.Tasks;

namespace Shop.Services
{
    public interface IFileManager
    {

        Task<string> Get(string fileName, string directory);
        Task<bool> Save(byte[] file, string fileName, string directory);
    }
}
