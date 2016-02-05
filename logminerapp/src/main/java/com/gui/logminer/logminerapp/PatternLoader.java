package com.gui.logminer.logminerapp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.logminer.main.LogMiner;


public class PatternLoader {

LogMiner logMiner=new LogMiner();

public PatternLoader(){
	logMiner.initialize();
	
	
}

/**
 * 
 * @param key
 * @return
 */
public JsonObject getPatternTree(String key, String logType){
	
	//JsonObject jsonObject=logMiner.getPatterns(keys[keys.length-1]);
	
	if (key==null || key.isEmpty() ){
		System.out.println("No keys sent");
		return null;
	}
		
	JsonObject jsonObject=logMiner.getPatterns(key, logType);
	/*Gson gson = new Gson();

    JsonElement jsonArray = gson.toJsonTree(a,Event[].class);
   
    JsonObject jsonObject = new JsonObject();
    jsonObject.addProperty("_id", "root");
    jsonObject.add("tree", jsonArray);*/
	//System.out.println(jsonObject);
    return jsonObject;
}


public String [] getFrequentPatterns(Integer numOfPat, String logType){
	return logMiner.getFrequentCommonPatterns(numOfPat,logType);
}

/**
 * 
 * @return
 */
public String [] getKeys(String logType){
	return logMiner.getPatternKeys(logType);
	
}

/**
 * 
 * @return
 */
public String [] geLogTypes(){
	return logMiner.getLogTypes();
	
}



}
