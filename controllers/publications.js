const pruebaPublication = (req,res)=>{
    return res.status(200).json({
        messague: "Mesanej enviado desde: controllers/publication.js"
    });
}

module.exports = {
    pruebaPublication
}