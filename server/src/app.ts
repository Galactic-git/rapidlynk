
import { Hono } from "hono";
import { generateDownloadUrl, generateUploadUrl, setTest , getFileSize } from "./services/s3.js";
import { ConnectionDBTest, recordDownload, recordUpload } from "./services/dynamodb.js"

const app = new Hono;

app.get("/health", (c) => {
    c.status(200)
    return c.text("server is running")
})


app.get("/test-s3", async (c) => {
    if (await setTest()) {
        return c.json({
            message: "connected to s3 successfully",
            bucket: "rapidlynk-storage-prod",
            connection: true
        })
    } else {
        return c.json({
            connection: false,
            message: "failed to connect to s3",
            bucket: "rapidlynk-storage-prod",
            error: "failed to connect to s3"
        })
    }
})

app.get("/api/download-url/:id", async (c) => {
    const { id } = c.req.param();

    try {
        const fileSize = await getFileSize(id);

        await recordDownload(fileSize);

        const downloadUrl = await generateDownloadUrl(id);

        return c.json({
            message: "download url generated successfully",
            url: downloadUrl
        });

    } catch (err) {
        return c.json({
            message: "failed to generate download url",
            error: err instanceof Error
                ? err.message
                : "unknown error"
        });
    }
});

app.post("/api/upload-url", async (c) => {
    const body = await c.req.json<{ filename?: string, size?: number }>();
    const filename = body.filename;
    const size: number | undefined = Number(body.size);
    console.log("size is ", typeof size, "filename is ", filename)

    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (
        size === undefined ||
        !Number.isFinite(size) ||
        size <= 0
    ) {
        return c.json(
            {
                message: "file size error",
                error: "size must be a positive number",
            },
            400
        );
    }

    if (size > MAX_FILE_SIZE) {
        return c.json(
            {
                message: "file size exceeds the limit of 500MB",
                error: "file size exceeds the limit of 500MB",
                maxSize: MAX_FILE_SIZE,
            },
            413
        );
    }

    if (size > MAX_FILE_SIZE) {
        console.log("file size exceeds the limit of 500MB");

        return c.json(
            {
                message: "file size exceeds the limit of 500MB",
                error: "file size exceeds the limit of 500MB",
                maxSize: MAX_FILE_SIZE,
            },
            413
        );
    }
    console.log("filename is ", filename)
    try {
        if (!filename) {
            return c.json({
                message: "filename is required",
                error: "filename is required"
            })
        }
        const { fileId, uploadUrl, fields } = await generateUploadUrl(filename, "application/octet-stream");
        return c.json({
            message: "upload url generated successfully",
            url: uploadUrl,
            fileId: fileId,
            fields: fields
        })
    }
    catch (err) {
        return c.json({
            message: "failed to generate upload url",
            error: err instanceof Error ? err.message : "unknown error"
        })
    }
})

export default app