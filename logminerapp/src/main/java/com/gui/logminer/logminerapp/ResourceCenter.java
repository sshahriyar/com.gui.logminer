package com.gui.logminer.logminerapp;

//import com.google.gson.Gson;
import java.net.URLDecoder;

import com.google.gson.JsonObject;

import spark.Request;
import spark.Response;
import spark.Route;
import static spark.Spark.get;
import static spark.Spark.put;
public class ResourceCenter {
	private static final String API_CONTEXT = "/api/v1";
	private PatternLoader pattern=new PatternLoader();
	public ResourceCenter(){}
	
	public void setupEndpoints(){
		//This code works for the URL: /tree?key=somekey&log=somelogtype
		get(API_CONTEXT + "/tree", "application/json", (request, response)-> {
					
					                   
                      String key=request.queryParams("key");
                      String logType=request.queryParams("log");
          			
                      if (logType==null  || logType.isEmpty()){
                      	response.status(404);
                   	    return "Invalid log type";
                      }
                      	
                      
	              		try {
							key=URLDecoder.decode(key, "UTF-8");
						} catch (Exception e) {
							response.status(404);
							return e.getMessage();
							
						}
                     
	              		if (key!=null){
                    	  JsonObject obj= pattern.getPatternTree(key,logType);
                    	  if (obj==null){
                    		  response.status(404);
                        	  return "No keys found";
                    	  }
                    	  return obj;
                      
	              		}else{
                    	  response.status(404);
                    	  return "Nothing corresponds to empty or null values";
                        }
                      
                });//, new JsonTransformer());
         /************************
		// This code works for query parameters: /adlog?key=someuserid
         get(API_CONTEXT + "/adlog", "application/json", 
        		(request, response)  -> pattern.getPattern(request.queryParams("key")));
        **************************/			
		// This code works for query parameters: /fp?num=somenumber&log=logtype
        get(API_CONTEXT + "/fp", "application/json", 
        		(request, response)  -> {
        		String num=request.queryParams("num");
        		String logType=request.queryParams("log");
        			
                if (logType==null  || logType.isEmpty()){
                	response.status(404);
             	    return "Invalid log type";
                }
                	
                Integer numPat=1;
        		try{
       			  numPat=Integer.parseInt(num);
       				
        		} catch(NumberFormatException | NullPointerException ex){
       			    response.status(404);
             	    return "Number of patterns not integer";
        		}
        		
        		return pattern.getFrequentPatterns(numPat,logType);
        		
        		
        	},new JsonTransformer());
        
       // This code works for the URL: /logtypes
        get(API_CONTEXT + "/logtypes", "application/json", 
        		(request, response)  -> pattern.geLogTypes(),new JsonTransformer());
        
        //This code works for the URL: /keyList/someLogtypeid
        get(API_CONTEXT + "/keylist/:log", "application/json", 
        		(request, response)  -> {
        			 String logType=request.params(":log");
        			
        			 if (logType==null  || logType.isEmpty()){
                     	response.status(404);
                  	    return "Invalid log type";
                     }
        			String [] keys= pattern.getKeys(logType);
        			if (keys ==null){
                         	response.status(404);
                    	    return "Invalid log type";
                       
        			 }
        			 
        			 return keys; 	
        		},new JsonTransformer());
        
    	/*put(API_CONTEXT + "/adlog:selectedKey", "application/json", (request, response) 
    			  -> { System.out.println("........"+request.params().toString()); 
    			  System.out.println("........"+request.body().toString()); 
                  return pattern.getPattern(request.params(":selectedKey"));}
                    , new JsonTransformer());*/
 
	}
}
