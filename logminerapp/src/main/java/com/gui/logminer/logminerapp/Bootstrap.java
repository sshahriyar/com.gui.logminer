package com.gui.logminer.logminerapp;




import static spark.Spark.setIpAddress;
import static spark.Spark.setPort;
import static spark.SparkBase.staticFileLocation;

public class Bootstrap {
	private static final String IP_ADDRRESS="localhost";
	private static final int PORT=8080;
	
   public static void main(String[] args) {
	   setIpAddress(IP_ADDRRESS);
	   setPort(PORT);
	   staticFileLocation("/public");
	   ResourceCenter rest=new ResourceCenter();
	   rest.setupEndpoints();
	   /* get("/", new Route() {
           @Override
           public Object handle(Request request, Response response) {
               return "Hello World!!";
           }
       });*/
   }
}