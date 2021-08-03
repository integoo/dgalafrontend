

Cómo hacer un respaldo de una Postresql DATABASE
a) Local:
pg_dump -Fc dgaladb > /home/ubuntu/backups/backup_dgaladb/dgaladb_$fecha.dump

b) Remota:
1) pg_dump -h decorafiestas.com -Fc -U ubuntu dgaladb > desarrollodb.dump

2) ssh user@remote_machine "pg_dump -U dbuser -h localhost -C --column-inserts" \
 > backup_file_on_your_local_machine.sql


Recuperar la Base de Datos de Desarrollo 
pg_restore -d desarrollodb dgaladb_$fecha.dump

UPDATE colaboradores SET "Password" = 'dfjiejoijeijfjgjrjojijg837439dkK' WHERE "ColaboradorId" <> 0;
INSERT INTO colaboradores VALUES (0, 'desarrollo', 'desarrollo', '$2b$10$PEBBj5HGAysvCnPEAh282uXTvEYieLEnYWf049swgaRTKqfOP4p4e', 99, USER,CLOCK_TIMESTAMP(), 'S');
#####################################################################################

ALTER TABLE cuotas_mes OWNER TO ubuntu;
#####################################################################################
For example, select a random number from between 5 and 105:

SELECT floor(random() * (105 - 5 + 1)) + 5 AS random_no;
#####################################################################################


<div className="PrincipalModifica" style={{display: this.state.disabledBotonesModifica ? "block" : "none"}}>
            <input />
</div>

//#####################################################################################
CREATE OR REPLACE FUNCTION public.fn_registro_contable_actualizaciones()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
IF (TG_OP = 'UPDATE') THEN
INSERT INTO registro_contable_actualizaciones 
SELECT OLD.*,NEW."Usuario";
RETURN OLD;
END IF;
RETURN NULL;
END;
$function$;

CREATE TRIGGER trg_registro_contable_actualizaciones 
AFTER UPDATE  ON registro_contable FOR EACH ROW EXECUTE PROCEDURE fn_registro_contable_actualizaciones();

//#####################################################################################
Para cargar un excel a Postgresql:
1. Grabar el archivo en formato csv 
2. Ponerle Encabezado a las columnas en el primer renglón.

COPY mytable FROM '/path/to/csv/file' WITH CSV HEADER; -- must be superuser
//#####################################################################################
Para desacargar o exportar un query de POSTGRESQL a un archivo csv
copy (select "CuentaContableId","SubcuentaContable" from subcuentas_contables order by 1,2) to '/Users/eugalde/sql/subcuentas_contables.csv' with csv delimiter ',' header ;
//#####################################################################################

My Public IP from Linux command line:
curl ifconfig.me
curl ipinfo.io/ip

curl ident.me
//#####################################################################################
Para conectarse de manera remota a un sevidor POSTGRESQL

psql -h decorafiestas.com -p 5432 -U ubuntu dgaladb



//#####################################################################################
Para tomar un número random para cargarlo como "FolioId"
select floor(random()*100000)+1000 as "FolioId"
//#####################################################################################


Descripcion = Descripcion.replace(/[^a-zA-Z0-9 &]/g,"")

//#### VALIDA QUE SEAN SOLO NUMEROS
let numbers = /^[0-9]+$/;
if (UnidadesConvertir.match(numbers) || UnidadesConvertir === ""){

}

if(window.confirm('Are you sure?')) {

}

numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  

  Descripcion = Descripcion.replace(/[^a-zA-Z0-9-  &]/g,"")    //Valida que solamente incluya de a-z de A-Z de 0-9, guiones y espacios
  CodigoBarras = CodigoBarras.replace(/[\\/.?]/g,"")    //Elimina los caracteres \ / . ? 
 
 SELECT '"'||"column_name"||'",' FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'traspasos' ORDER BY "ordinal_position";
 //###############################################################
 arreglo = [1,2,3,4,5,6,7,8,9]

const total = arreglo.reduce((suma, element)=>{
  return suma + element
},0)

console.log(total)
 //###############################################################
 Elimina $ y , y valida que acepte números y punto 
 
 let Monto = e.target.value.replace(/[$ ,]/g,"")
    Monto = Monto.replace(/[^0-9 .]/g,"")
 //###############################################################

 ALTER TABLE registro_contable ALTER COLUMN "FechaHoraAlta" TYPE timestamptz;

ALTER TABLE child_table ADD CONSTRAINT constraint_name 
FOREIGN KEY (fk_columns) 
REFERENCES parent_table (parent_key_columns);

ALTER TABLE registro_contable ADD COLUMN "Id" serial;

DROP TRIGGER trg_registro_contable_actualizaciones ON registro_contable;

ALTER TABLE registro_contable DROP CONSTRAINT registro_contable_pkey;

ALTER TABLE registro_contable DROP COLUMN "FolioId"            ;

ALTER TABLE registro_contable RENAME COLUMN "xFolioId"            TO "FolioId";

ALTER TABLE registro_contable ADD PRIMARY KEY("FolioId","SucursalId");
ALTER TABLE registro_contable ADD CONSTRAINT fk_cuentascontable     FOREIGN KEY ("CuentaContableId") REFERENCES cuentas_contables("CuentaContableId");

ALTER TABLE registro_contable ALTER COLUMN "FolioId"            SET  not null ;

CREATE trigger trg_registro_contable_actualizaciones AFTER UPDATE ON registro_contable FOR EACH ROW EXECUTE FUNCTION fn_registro_contable_actualizaciones();


 //###############################################################
 

import React, { Component } from 'react'

class AAEjemplos extends React.Component{

//select CASE WHEN (exists(select 1 where 1=2))='f' THEN '0' ELSE '1'end;


    //  formatDate(date) {
  //     var d = new Date(date),
  //         month = '' + (d.getMonth() + 1),
  //         day = '' + d.getDate(),
  //         year = d.getFullYear();

  //     if (month.length < 2)
  //         month = '0' + month;
  //     if (day.length < 2)
  //         day = '0' + day;

  //     return [year, month, day].join('-');
  // }

//select "SucursalId","CodigoId", CAST((("CostoPromedio" /(1-("MargenReal"/100)))* "IVA"/100)- "IVAMonto" AS DEC(4,2) from inventario_perpetuo order by "SucursalId","CodigoId" ;

    deleteItem(event){
        alert(event.target.value)
        alert(event.target.name)
        alert("Si borra")
      //alert(event.target.value)
      console.log(event)
    }
    render(){
        return(
            <React.Fragment>
                <button name="deleteButton" id="deleteButton" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteItem(e) } }>Delete</button>
                {/* <button className="btn btn-danger btn-lg" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(item) } } >Borrar</button>  */}
                <button name="deleteButton" id="deleteButton" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteItem(e) } }>Delete</button>
        <button onClick={() => { if(window.confirm('Are you sure?')) alert("OK")}}>Hey</button>

        <form>
            <input type="numeric" 
                    pattern="[0-9]{3}" placeholder="Monto $$$" />
            <button onclick="go(event)">Ejecuta</button>
            <button type="submit">Submit</button>
        </form>

            </React.Fragment>
        )
    }
    
}

export default AAEjemplos 
//############################################################################################## 

<div style={{ display: showInfo ? "block" : "none" }}>info</div>
//############################################################################################## 