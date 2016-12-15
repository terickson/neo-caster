import {logger} from './logger';
import {makeRequest} from './requestService';

export function lambaForecast(forecastName:string, startDay:number, endDay:number, lambda:any){
  let errorResponse = "I'm currently having difficulty getting the information back from Nasa please try again later.";
  let requestUrl = "https://api.nasa.gov/neo/rest/v1/feed?detailed=false&api_key=5oVZUnKbJjyQpLTYuvAG419q9tjNVZppcIJwSI5b";
  requestUrl += "&start_date=" + getFormatedDate(startDay);
  requestUrl += "&end_date=" + getFormatedDate(endDay);
  let errorFunction = function error(err:any){
    logger.error(err);
    lambda.emit(':tell', errorResponse);
  }
  let successFunction = function error(forecastResponse:any){
    try{
      lambda.emit(':tell', interpretForcast(forecastName, forecastResponse, errorResponse));
    }catch(err){
      logger.error(err);
      lambda.emit(':tell', errorResponse);
    }
  }
  logger.debug("nasa url: " + requestUrl);
  makeRequest("GET", null, requestUrl, null).then(successFunction, errorFunction);
}

function getFormatedDate(days:number){
  let date = new Date();
  let res = date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  let d = new Date(res);
  let month = d.getMonth() + 1;
  let day = d.getDate();

  return d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}

function niceDate(nasaDate:string){
  let months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let nasaDateArray = nasaDate.split("-");
  return months[parseInt(nasaDateArray[1]) - 1] + " " + parseInt(nasaDateArray[2]);
}

function interpretForcast(forecastName:string, forecastResponse:any, errorResponse:string){
  if(forecastResponse.statusCode != 200){
    return errorResponse;
  }
  let foreCastData = forecastResponse.body;
  if(!foreCastData){
    return errorResponse;
  }

  let neoCount = foreCastData.element_count;
  if(neoCount < 1){
    return "No need to worry, it looks like there are no neos in " + forecastName + ".";
  }
  let hazardous:any[] = [];
  for(let i in foreCastData.near_earth_objects){
    let neos = foreCastData.near_earth_objects[i];
    for(let k = 0; k < neos.length; k++){
      let neo = neos[k];
      if(neo.is_potentially_hazardous_asteroid){
        neo["neoDate"] = i;
        hazardous.push(neo);
      }
    }
  }
  if(hazardous.length < 1){
    return "No need to worry, there are " + neoCount + " neos in " + forecastName + " but none of them are hazardous.";
  }
  let forecastMessage = "So it looks like there are " + neoCount + " neos in " + forecastName + " and " + hazardous.length + " we should keep an eye on. ";

  for(let j = 0; j < hazardous.length; ++j){
    if(j > 0){
      forecastMessage += ", ";
      if(j === (hazardous.length - 1)){
        forecastMessage += "and ";
      }
    }
    logger.debug(hazardous[j]);
    forecastMessage += "object " + (j + 1) + ": " +hazardous[j].name + " which is scheduled to miss us by " + hazardous[j].close_approach_data[0].miss_distance.miles + " miles on " + niceDate(hazardous[j]["neoDate"]);
  }
  return forecastMessage;
}
