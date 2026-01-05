import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//Get notes
router.get("/", protect ,async (req ,res) =>{
    try{
        const notes =await Note.find({createdBy: req.user._id});
        res.json(notes);
    }catch (err){
        console.error("Get all notes error:" ,err);
        res.status(500).json({message: "Server error"});
    }
})
// create a note 
router.post("/" ,protect ,async (req ,res) =>{
    const {title ,description} =req.body;
    try{
        if(!title || !description){
            return res.status(400).json({message: "Please fill all the fields"})
        }
        const note =await Note.create({
            title ,description ,createdBy: req.user._id
        })
    }catch(err){
         return res.status(500).json({message: "server error"});
    }
});

//get a note
router.get("/:id" ,protect ,async (req ,res) =>{
    try{
        const note =await Note.findById(req.params.id);
        if(!note){
               return res.status(400).json({message: "Note not found"});
        }
        
    }catch(err){
          return res.status(500).json({message: "server error"});
    }
});
// Update a note

router.put("/:id" ,protect ,async (req ,res) =>{
    const {title ,description} =req.body;
    try{
        const note =await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message :"Note not found"});
        }
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }

        note.title =title || note.title;
        note.description =description || note.description;

        const updateCode =await note.save();
        res.json(updateCode);
    }catch(err){
        res.status(500).json({message: "Server error"});
    }

});

//delete a router
router.delete("/:id", protect ,async(req ,res) =>{
    try{
         const note =await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({message :"Note not found"});
        }
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Not authorized"});
        }
        await note.deleteOne();
        res.json({message :" Note was deleted"});
    }catch{
        res.status(500).json({message: "Server error"});
    
    }
})

export default router;
