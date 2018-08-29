﻿using Amazon.S3;
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

        public async Task<string> Get(string fileName, string directory = null)
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
                {
                    return await reader.ReadToEndAsync();
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to load a file | fileName:{fileName}, directory:{directory}, bucketName:{bucketName}, error:{e.Message}");
                return null;
            }
        }

        public async Task<bool> Save(byte[] file, string fileName, string directory = null)
        {
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
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to upload a file | fileName:{fileName}, directory:{directory}, bucketName:{bucketName}, error:{e.Message}");
                return false;
            }
        }

        private string ResolveBucketName(string directory)
        {
            return string.IsNullOrEmpty(directory) ? bucketName : $"{bucketName}/{directory}";
        }
    }
}
