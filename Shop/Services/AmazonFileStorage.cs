using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Shop.Services
{
    public class AmazonFileStorage : IFileManager
    {
        const string bucketName = "shop20180707014520";

        private readonly IAmazonS3 _s3Client;
        private readonly ILogger _logger;

        public AmazonFileStorage(
            IAmazonS3 s3Client,
            ILogger<AmazonFileStorage> logger
        )
        {
            _s3Client = s3Client;
            _logger = logger;
        }

        public async Task<byte[]> Get(string directory, string fileName)
        {
            var request = new GetObjectRequest
            {
                Key = fileName,
                BucketName = this.ResolveBucketName(directory)
            };

            try
            {
                using (var response = await _s3Client.GetObjectAsync(request))
                using (var responseStream = response.ResponseStream)
                using (var reader = new StreamReader(responseStream))
                using (var memstream = new MemoryStream())
                {
                    var buffer = new byte[512];
                    var bytesRead = default(int);
                    while ((bytesRead = reader.BaseStream.Read(buffer, 0, buffer.Length)) > 0)
                        memstream.Write(buffer, 0, bytesRead);
                    return memstream.ToArray();
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to load a file | fileName:{fileName}, directory:{directory}, bucketName:{bucketName}, error:{e.Message}");
                return null;
            }
        }

        public async Task<string> Save(byte[] file, string directory = null, string fileName = null)
        {
            fileName = this.ResolveFileName(fileName);

            var utility = new TransferUtility(_s3Client);
            var request = new TransferUtilityUploadRequest
            {
                Key = fileName,
                BucketName = this.ResolveBucketName(directory),
                InputStream = new MemoryStream(file)
            };

            try
            {
                await utility.UploadAsync(request);
                return fileName;
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to upload a file | fileName:{fileName}, directory:{directory}, bucketName:{bucketName}, error:{e.Message}");
                return null;
            }
        }

        private string ResolveFileName(string fileName)
        {
            return string.IsNullOrEmpty(fileName) ? Guid.NewGuid().ToString() : fileName;
        }

        private string ResolveBucketName(string directory)
        {
            return string.IsNullOrEmpty(directory) ? bucketName : $"{bucketName}/{directory}";
        }
    }
}
