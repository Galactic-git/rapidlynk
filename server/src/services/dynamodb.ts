import { DynamoDBClient, DescribeTableCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = process.env.AWS_REGION || "ap-south-1";
const TABLE_NAME = process.env.DYNAMODB_TABLE || "rapidlynk-metrics";

const dynamoDBClient = new DynamoDBClient({ region: REGION });


export async function ConnectionDBTest() {
    try {
        const command = new DescribeTableCommand({
            TableName: TABLE_NAME
        })

        const response = await dynamoDBClient.send(command)
        return {
            connection: true,
            table: response.Table?.TableName,
            status: response.Table?.TableStatus,
        }
    } catch (e) {
        console.log("error at connecting to db ", e);
        return {
            connection: false,
            error: e instanceof Error ? e.message : "unknown error"

        }
    }
}


function getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7);
}


export async function recordUpload(fileSize: number) {
    const month = getCurrentMonth();

    await dynamoDBClient.send(
        new UpdateItemCommand({
            TableName: TABLE_NAME,

            Key: {
                month: {
                    S: month,
                },
            },

            UpdateExpression: `
        ADD #uploads :one,
            #uploadedBytes :fileSize
        SET #lastUpdated = :now
      `,

            ExpressionAttributeNames: {
                "#uploads": "uploads",
                "#uploadedBytes": "uploadedBytes",
                "#lastUpdated": "lastUpdated",
            },

            ExpressionAttributeValues: {
                ":one": {
                    N: "1",
                },
                ":fileSize": {
                    N: String(fileSize),
                },
                ":now": {
                    S: new Date().toISOString(),
                },
            },
        })
    );

    // Update largestUploadBytes separately
    try {
        await dynamoDBClient.send(
            new UpdateItemCommand({
                TableName: TABLE_NAME,

                Key: {
                    month: {
                        S: month,
                    },
                },

                UpdateExpression: `
          SET #largestUploadBytes = :fileSize
        `,

                ConditionExpression: `
          attribute_not_exists(#largestUploadBytes)
          OR #largestUploadBytes < :fileSize
        `,

                ExpressionAttributeNames: {
                    "#largestUploadBytes": "largestUploadBytes",
                    
                },

                ExpressionAttributeValues: {
                    ":fileSize": {
                        N: String(fileSize),
                    },
                },
            })
        );
    } catch (error: any) {
        // ConditionalCheckFailedException simply means
        // the existing largest file is already bigger.
        if (error.name !== "ConditionalCheckFailedException") {
            throw error;
        }
    }
}

export async function recordDownload(fileSize: number) {
    const month = getCurrentMonth();
    const command = new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
            month: {
                S: month
            },
        },


        UpdateExpression: `
        ADD #downloads :one,
            #downloadedBytes :fileSize
        SET #lastUpdated = :now
      `,

        ExpressionAttributeNames: {
            "#downloads": "downloads",
            "#downloadedBytes": "downloadedBytes",
            "#lastUpdated": "lastUpdated",
        },

        ExpressionAttributeValues: {
            ":one": {
                N: "1",
            },
            ":fileSize": {
                N: String(fileSize),
            },
            ":now": {
                S: new Date().toISOString(),
            },
        },


    })
    try {
        const response = await dynamoDBClient.send(command)
    } catch (e) {
        console.log("error in updating the download records")
        throw e; 
    }

}
// ConnectionDBTest();