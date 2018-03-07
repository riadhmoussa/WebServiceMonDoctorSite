const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

router.post('/signin',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from medecin where Email='"+req.body.loginEmail+"' and MotDePasse='"+req.body.loginPassword+"'";
    connection.query(sql,(err,rows,fileds)=>{
        if(!err){
            numRows = rows.length;
            if(numRows>0){
                const tokenMed = jwt.sign({
                    idMedecin:rows[0].idMedecin,
                    NomMedecin:rows[0].NomMedecin,
                    PrenomMedecin:rows[0].PrenomMedecin,
                    Email:rows[0].Email,
                    ImagePathMedecin:rows[0].ImagePathMedecin,
                    VilleMedecin:rows[0].VilleMedecin
                },
            "secretMonDoctor",
        {
            expiresIn:"24h"
        });
        res.status(200).json({
            msg:'AuthMedSuccs',tokenMed:tokenMed
        })
            }else{
                res.status(200).json({
                    msg:'AuthMedFailed'
                })
            }
        }
    });
    connection.end();
    
});
router.post('/signup',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO Medecin (Email,MotDePasse,NomMedecin,PrenomMedecin,CINMedecin,MatMedecin,Sexe,AdresseMedecin,VilleMedecin,CodePostalMedecin,NumTelPortableMedecin,NumTelFixMedecin,ImagePathMedecin) VALUES ('"+req.body.Email+"','"+req.body.MotDePasse+"','"+req.body.NomMedecin+"','"+req.body.PrenomMedecin+"','"+req.body.CINMedecin+"','"+req.body.MatMedecin+"','"+req.body.Sexe+"','"+req.body.AdresseMedecin+"','"+req.body.VilleMedecin+"','"+req.body.CodePostalMedecin+"','"+req.body.NumTelPortableMedecin+"','"+req.body.NumTelFixMedecin+"','"+req.body.ImagePathMedecin+"')"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:rows.insertId
            });
        }else{
            res.status(200).json({
                message : 'medecin add failed'
            });
        }
    });
    connection.end();
});


router.get('/UserMed/:MedID',(req,res,next)=>{
    const decc = jwt.decode(req.params.MedID,'secretMonDoctor');
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from medecin where idMedecin='"+decc.idMedecin+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows[0]
            });
        }
    });
    connection.end();
});
router.get('/ListePatien/:MedID',(req,res,next)=>{
    const decc = jwt.decode(req.params.MedID,'secretMonDoctor');
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from patient where idMedecin='"+decc.idMedecin+"' ";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});


router.post('/AddPatient',(req,res,next)=>{
    const decc = jwt.decode(req.body.idMedecin,'secretMonDoctor');
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO Patient(idMedecin,CINPatient,NomPatient,PrenomPatient,Sexe,AdressePatient,VillePatient,CodePostalPatient,NumTelPatient,EmailPatient,ImagePathPatient) values("+decc.idMedecin+","+req.body.CINPatient+",'"+req.body.NomPatient+"','"+req.body.PrenomPatient+"','"+req.body.Sexe+"','"+req.body.AdressePatient+"','"+req.body.VillePatient+"',"+req.body.CodePostalPatient+","+req.body.NumTelPatient+",'"+req.body.EmailPatient+"','https://firebasestorage.googleapis.com/v0/b/mondoctor-e0a88.appspot.com/o/physician_head_doctor.png?alt=media&token=02bb1025-17b9-4f54-bd4a-49d7a3abbeec')"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:rows.insertId
            });
        }else{
            res.status(200).json({
                message : 'patient add failed'
            });
        }
    });
    connection.end();

});



router.get('/VisitPatient/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from patient where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows[0]
            });
        }
    });
    connection.end();
});



router.post('/AddCommentPat',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO commentairepatient(ContenuCommentaire,idPatient) values('"+req.body.ContenuCommentaire+"',"+req.body.idPatient+")"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:'comment add'
            });
        }else{
            res.status(200).json({
                message : 'comment add failed'
            });
        }
    });
    connection.end();
});


router.get('/GetReglement/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from reglement where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();

});

router.post('/AddReglement',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    console.log(req.body.Montant)
    console.log(req.body.idPatient)
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO reglement(Montant,idPatient) values("+req.body.Montant+","+req.body.idPatient+")"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:'Montant add'
            });
        }else{
            res.status(200).json({
                message : 'Montant add failed'
            });
        }
    });
    connection.end();

});

router.post('/AddImageMedicale',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO imagemedical(cheminImage,idPatient) values('"+req.body.cheminImage+"',"+req.body.idPatient+")"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:'ImageMedicale add'
            });
        }else{
            res.status(200).json({
                message : 'ImageMedicale add failed'
            });
        }
    });
    connection.end();
});


router.get('/GetImageMedicale/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from imagemedical where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});

router.post('/AddRDV',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO rdv(idPatient,idMedecin,HeureRDV,DateRDV) values("+req.body.idPatient+","+req.body.idMedecin+",'"+req.body.HeureRDV+"',STR_TO_DATE('"+req.body.DateRDV+"','%Y-%m-%d'))"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:'rdv add'
            });
        }else{
            res.status(200).json({
                message : 'rdv add failed'
            });
        }
    });
    connection.end();
});


router.get('/GetPatientRDV/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from rdv where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});

router.get('/GetCommentsPat/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from commentairepatient where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});

router.get('/AllRDV/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select patient.ImagePathPatient,patient.NomPatient,patient.PrenomPatient,patient.NumTelPatient,rdv.DateRDV,rdv.HeureRDV from rdv,patient where rdv.idMedecin='"+req.params.MedID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});

router.post('/AddArticle',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO Article(ContenuArticle,idMedecin) values('"+req.body.ContenuArticle+"',"+req.body.idMedecin+")"
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:rows.insertId
            });
        }else{
            res.status(200).json({
                message : 'article add failed'
            });
        }
    });
    connection.end();

});

router.get('/GetArticle/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from article where idMedecin='"+req.params.MedID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});

router.post('/ADDCertificat',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO certificat(idPatient,DateDebut,Duree) values("+req.body.idPatient+",STR_TO_DATE('"+req.body.DateDebut+"','%Y-%m-%d'),"+req.body.Duree+")";
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:rows.insertId
            });
        }else{
            res.status(200).json({
                message : 'certificat add failed'
            });
        }
    });
    connection.end();
});
router.get('/GetCertificat/:PatID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from certificat where idPatient='"+req.params.PatID+"'";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});
router.post('/AjouterCabinet',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO Cabinet(Log,Lat,Description,idMedecin) values("+req.body.Log+","+req.body.Lat+",'"+req.body.Description+"',"+req.body.idMedecin+")";
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:rows.insertId
            });
        }else{
            res.status(200).json({
                message : 'Cabinet add failed'
            });
        }
    });
    connection.end();
});

router.get('/GetSpecialte',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from specialite ";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});
router.get('/GetMedecinCbinet/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select * from cabinet where idMedecin="+req.params.MedID+"; ";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});
router.patch('/MisAJour/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="UPDATE cabinet SET Log="+req.body.Log+",Lat="+req.body.Lat+",Description='"+req.body.Description+"' WHERE idMedecin="+req.params.MedID+"; "
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows.affectedRows 
            });
        }
    });
    connection.end();
});

router.patch('/ChangeMotDePasse/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="UPDATE medecin SET MotDePasse='"+req.body.NewMotDePasse+"' WHERE idMedecin="+req.params.MedID+" and MotDePasse="+req.body.LastMotDePasse+" "
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows.affectedRows 
            });
        }
    });
    connection.end();
});
router.post('/AjouterSpecialite',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="INSERT INTO medecinspecialite(idSpecialite,idMedecin) values("+req.body.idSpecialite+","+req.body.idMedecin+")";
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message:'Specialite add'
            });
        }else{
            res.status(200).json({
                message : 'Specialite add failed'
            });
        }
    });
    connection.end();
});
router.get('/AfficherMedecinSpecialite/:MedID',(req,res,next)=>{
    var config={
        host:'127.0.0.1',
        user:'root',
        password:'12345',
        database:'mondoctor'
    }
    var connection = mysql.createConnection(config);
    var sql="select specialite.LibelleSpecialite from specialite,medecinspecialite where specialite.idSpecialite=medecinspecialite.idSpecialite and medecinspecialite.idMedecin="+req.params.MedID+" ";
    connection.query(sql,(err,rows,filed)=>{
        if(!err){
            res.status(200).json({
                info:rows
            });
        }
    });
    connection.end();
});
module.exports = router;