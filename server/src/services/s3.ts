import {GetObjectCommand, PutObjectCommand, S3Client , HeadBucketCommand  , HeadObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { randomBytes} from "node:crypto";
import {createPresignedPost} from "@aws-sdk/s3-presigned-post";



const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET_NAME = process.env.S3_BUCKET || "rapidlynk-storage-prod";
const s3Client = new S3Client({region: REGION});
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB    




export async function generateUploadUrl(fileName: string, contentType = "application/octet-stream"): Promise<{ fileId: string, uploadUrl: string, fields: Record<string, string> }> {
    
    const fileId = randomBytes(16).toString("hex");
    
    const {url , fields  } = await createPresignedPost(s3Client , {
        Bucket: BUCKET_NAME,
        Key: `bundles/${fileId}`,
         Fields: {
      "Content-Type": contentType,
    },
        Conditions: [
        ["content-length-range", 1, MAX_FILE_SIZE], // Limit file size to 500MB
        ["eq", "$Content-Type", contentType],
        ],
        Expires: 900, // URL expiration time in seconds (15 minutes)
    });
    
    

     return { fileId, uploadUrl: url , fields };
    
}

export async function generateDownloadUrl(filId: string): Promise<string> {
    const getCommand = new GetObjectCommand({
        Bucket : BUCKET_NAME,
        Key : `bundles/${filId}`
     })


     const getUrl = await getSignedUrl(s3Client , getCommand  , {
        expiresIn : 900
     })
  

     console.log( " get Url is " , getUrl )
    return getUrl;
}

export async function setTest(){
   try{
    
        const command  = new HeadBucketCommand({
            Bucket : "rapidlynk-storage-prod"
        })
        await s3Client.send(command)

    console.log("Bucket exists and is accessible.");
    return true;
   }catch(err){
    
    console.error("Error connecting to S3:", err);
    return false;
   }
    

   
}


export async function getFileSize(fileId: string): Promise<number> {
  const response = await s3Client.send(
    new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `bundles/${fileId}`,
    })
  );

  if (response.ContentLength === undefined) {
    throw new Error("Could not determine file size");
  }

  return response.ContentLength;
}

