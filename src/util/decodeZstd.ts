import zstd from '@mongodb-js/zstd';

/**
 * Retrieves the RPC API URL for the specified cluster
 */

export async function decodeZstd(base64ZstdData: string) {
  // Decode Base64 to binary
  const compressedData = Buffer.from(base64ZstdData, 'base64');
  const decompressedData = await zstd.decompress(compressedData);

  return decompressedData.toString();
}
