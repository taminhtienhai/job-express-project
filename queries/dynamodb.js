const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'ASIA4P5MXXQW4WCNLI5L',
    secretAccessKey: 'ASIA4P5MXXQW4WCNLI5L',
    sessionToken: 'FQoGZXIvYXdzEPn//////////wEaDEkrhATk9jV4mDXfvSKGAugVagzFvk4cNKoAko7j+NPBoKII9Ge2P7AXaYOnrx4KoeVicbJRjdnTKEN+BdCyAtoAKpCmnBY5wlV2EQWJV+34Hh+VseUZmR84JOUs3F2nJUHLEhYqzB510TyxnEEYub91wXVPX8G/84C4qwZ/bDIaruOcXFiPTuPtEhYANIZS7m4/9Sy9HFbepD14wcP4oweh15PRB67zyFXg1Yz4gKFYODseiQC2HBWYTuIMGWwCu9oORdG/QAt1eoznCkINkmkwQ+OSp2A8hzvBWeZwOfOLfd9R4KgBs4nkNG3ag27uC/4gxtMijc4KnBesciC5XB72f2TSHEsaPNyjnSbXeFofPxAcqb8ov6fx7QU=',
    region: 'us-east-1',
    endpoint: 'ec2-3-93-3-52.compute-1.amazonaws.com'
})

module.exports = {
    dynamo: () => {
        return new AWS.DynamoDB()
    },
    client: () => {
        return new AWS.DynamoDB.DocumentClient()
    }
}