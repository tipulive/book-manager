import type { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {db} from '../utils/db.js';
import {env} from '../config/env.js';
const JWT_SECRET = env.JWT_SECRET || "supersecret";

export const register=async(req:Request,res:Response)=>{
    const{username,email,password}=req.body;
    try {
        const hashed=await bcrypt.hash(password,10);
        const[rows]:any=await db.query("select email from users where email=? limit 1",[email]);
        if(rows.length) return res.status(403).json({message:"User already exist please add new one"});
        await db.query("insert into users(username,email,password) values(?,?,?)",[username,email,hashed]);
        res.status(200).json({
            message:"successful inserted"
        });
    } catch (err:any) {
        res.status(400).json({
            error:err.message
        });
        
    }
}
export const login=async(req:Request,res:Response)=>{
    const{email,password}=req.body;
    try {
        const[rows]:any=await db.query("select *from users where email=? limit 1",[email]);
        if(!rows.length) return res.status(404).json({message:"User Not found"});
        const User=rows[0];
        const isPassValid=await bcrypt.compare(password,User.password);
        if(!isPassValid) return res.status(404).json({message:"password Not Valid"});
       const Token=Jwt.sign({
        id:User.id,
        surname:User.surname,
        email:User.email
       },JWT_SECRET,{expiresIn:'5 min'});
       res.status(200).json({
        Token
       });
    
    } catch (err:any) {
        res.status(400).json({
            error:err.message
        });
        
    }

}