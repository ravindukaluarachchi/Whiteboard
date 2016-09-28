/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.rav.ws;

import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


@ServerEndpoint("/xy")
public class XYServer {
    private static final ArrayList<Session> sessions = new ArrayList<>();
    
    @OnOpen
    public void onOpen(Session session){
        try {
            session.getBasicRemote().sendText(session.getId());
            sessions.add(session);
        } catch (IOException ex) {
            Logger.getLogger(XYServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @OnMessage
    public void onMessage(String message,Session session){
         try {            
            
            for(Session s :sessions){
                System.out.println(message);
                               
                s.getBasicRemote().sendText(message);
            }
        } catch (IOException ex) {
            Logger.getLogger(XYServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @OnClose
    public void onClose(Session session){
        sessions.remove(session);
    }
}
