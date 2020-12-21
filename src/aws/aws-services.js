const AWS = require('aws-sdk');

const useLocal = process.env.NODE_ENV !== 'production'

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

const getAwsEndPoint = () => {
    return useLocal ? 'http://localhost:4566' : undefined
}

const s3 = new AWS.S3({credentials, endpoint: getAwsEndPoint(), s3ForcePathStyle: true;})

const dynamodb = AWS.DynamoDB({credentials, endpoint: getAwsEndPoint()})

let list= s3.listBuckets().promise();
list.then( data => console.log(data)).catch(err => console.error(err));

console.log(list);