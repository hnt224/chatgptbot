import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { configureOpenAI } from '../config/openai-config.js';
import OpenAI from 'openai';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORGANIZATION_ID,

});

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR token malfunctioned" });
    }

    // Grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role: role as 'system' | 'user' | 'assistant',
      content,
    }));

    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Send all chats with new one to OpenAI API
    const chatResponse = await openai.chat.completions.create({
      messages: chats,
      model: "gpt-4o-mini", // Update to the correct model
    });

    user.chats.push(chatResponse.choices[0].message);

    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async( req: Request,
  res: Response,
  next: NextFunction)=>{
    try {
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not registered OR token malfunctioned" });
      }
      if(user._id.toString() !== res.locals.jwtData.id){
        return res.status(401).send("Permissions didn't match");
      }
      return res.status(200).json({message: "OK", chats: user.chats});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "ERROR", cause:error.message});
    }
};


export const deleteChats = async( req: Request,
  res: Response,
  next: NextFunction)=>{
    try {
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not registered OR token malfunctioned" });
      }
      if(user._id.toString() !== res.locals.jwtData.id){
        return res.status(401).send("Permissions didn't match");
      }
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res.status(200).json({message: "OK"});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: "ERROR", cause:error.message});
    }
};