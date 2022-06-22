import Persona from "../models/persona.js"
import bcryptjs from "bcryptjs" 
import {generarJWT} from "../middlewares/validar.js"

const personaMostar=async (req, res) => {
    const persona= await Persona.find();
    res.json({persona})
    
}
const personaPost = async(req,res)=>{
    const {email,password,nombre,apellido,edad,alias,foto}=req.body
    const persona= new Persona({email,password,nombre,apellido,edad,alias,foto})
    const salt= bcryptjs.genSaltSync(10)
    persona.password=bcryptjs.hashSync(password, salt)
    persona.save()
    res.json({
        persona
    })
}

const personaLogin= async (req, res) => {
    const{email,password}=req.body
    const persona= await Persona.findOne({email});
    const validar=bcryptjs.compareSync(password,persona.password)
    const token = await generarJWT(persona.id);

    res.json({
        persona,
        token
    })

    if(validar)
        res.json({
            persona
        })
    else
        res.json({
            msg:"no puede ingresar"
        })   
}

const personaDelete= async (req, res) => {
    const {email}=req.body
    const persona= await Persona.findOneAndDelete({email});
    res.json({
        persona
    })
    
}

const personaput= async (req, res) => {
    const{id}=req.params
    const{_id,createAt,estado,...resto}=req.body;
    const modificar= await Persona.findByIdAndUpdate(id,resto);
    res.json({
        modificar
    })
}

const personaGetId=async(req,res)=>{
    const {id}=req.body
    const persona= await Persona.findById(id);
    res.json({persona})
}

const personaActivar=async (req, res) => {
    const{id}=req.params;
    const persona= await Persona.findByIdAndUpdate(id,{estado:1})
    res.json({
        persona
    })
}

const personaDesactivar=async (req, res) => {
    const{id}=req.params;
    const persona= await Persona.findByIdAndUpdate(id,{estado:0})
    res.json({
        persona
    })
}





export{personaPost,personaLogin,personaDelete,personaput,personaGetId,personaActivar,personaDesactivar,personaMostar}