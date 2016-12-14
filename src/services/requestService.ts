import requestPromise = require('request-promise');

export function makeRequest(operation:string, headers: Object, requestUrl:string, data:any): Promise<any>{
  let requestOptions:any = {
      url: requestUrl,
      method: operation,
      rejectUnauthorized: false,
      requestCert: true,
      strictSSL: false,
      resolveWithFullResponse: true,
      headers: headers,
      json: true
    };

    if(data){
      requestOptions['json'] = data;
    }

    return requestPromise(requestOptions).promise();
}
