import Pelicula from "../models/pelicula.js"
import subirArchivo from "../helpers/subir-archivo.js"

const peliculaPost=async(req,res)=>{
    const {tituloOriginal,tituloEspañol,fechaLanzamiento,genero,calificacion,sinopsis,director,escritor,repartoPrincipal,estado,idiomaOriginal,presupuesto,ingresos}=req.body
    const pelicula= new Pelicula({tituloOriginal,tituloEspañol,fechaLanzamiento,genero,calificacion,sinopsis,director,escritor,repartoPrincipal,estado,idiomaOriginal,presupuesto,ingresos})
    pelicula.save()
    res.json({pelicula})
}

const peliculaGet=async(req,res)=>{
    const pelicula= await Pelicula.find();
    res.json({pelicula})
}

const peliculaGetId=async(req,res)=>{
    const {id}=req.body
    const pelicula= await Pelicula.findById(id);
    res.json({pelicula})
}
const peliculaDelate=async(req,res)=>{
    const {tituloOriginal}=req.body
    const pelicula= await Pelicula.findOneAndDelete({tituloOriginal})
    res.json({pelicula,
    msg:"acaba de eliminar la pelicula"})
}

const peliculaGetNombre=async(req,res)=>{
    const{titulo}=req.query
    const pelicula= await Pelicula.find({$or:[
        {tituloOriginal:new RegExp(titulo,"i")},
        {tituloEspañol:new RegExp(titulo,"i")}
    ]});
    res.json({pelicula})
}

const peliculaActores=async (req, res)=>{
    const {id}=req.body;
    const peliculas = await Pelicula.find().where('repartoPrincipal.act').in(id).exec();
    res.json({
        peliculas
    })
}

const cargarArchivo=async (req, res) => {
    const { id } = req.params;
    try {
        let nombre
        await subirArchivo(req.files, undefined)
            .then(value => nombre = value)
            .catch((err) => console.log(err));

        //persona a la cual pertenece la foto
        let pelicula = await Pelicula.findById(id);
        if (pelicula.foto) {
            const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
            const pathImage = path.join(__dirname, '../uploads/', pelicula.foto);
            
            if (fs.existsSync(pathImage)) {
                console.log('Existe archivo');
                fs.unlinkSync(pathImage)
            }
            
        }
       
        pelicula = await Pelicula.findByIdAndUpdate(id, { foto: nombre })
        //responder
        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ error, 'general': 'Controlador' })
    }

}

export{peliculaPost,peliculaGet,peliculaGetId,peliculaDelate,peliculaGetNombre,peliculaActores,cargarArchivo}