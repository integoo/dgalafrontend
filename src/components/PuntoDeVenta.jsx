import React from "react";
import "./PuntoDeVenta.css";

class PuntoDeVenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sucursales: [],
      SucursalId: "",
      detalles: [],
      CodigoBarras: "",
      totalTicket: 0.0,
      VentanaDescripcion: "",
      VentanaDescripcionDetalles: [],
      detallesNotas: [],
      NotasEncabezados: [],
      detallesNotaSeleccionada: [],
      NotaId: 0,
      cantidadNotasAbiertas: 0,
      NotaModificada: false,
      clientes: [],
      ClienteId: 0,
    };
    this.CodigoBarrasInput = React.createRef();
    this.ventanadescripcionInput = React.createRef();
  }

  async componentDidMount() {
    const arregloSucursales = await this.getSucursales();
    if (arregloSucursales.error) {
      alert(arregloSucursales.error);
      return;
    }
    const SucursalId = arregloSucursales[0].SucursalId;

    //##############################################
    const arregloNotasActivas = await this.getNotas(SucursalId); //Consulta todas las notas

    let json = {};
    let arregloNotasEncabezados = [];
    let vvNotaId = 0;
    let numeroDeNotas = 0;
    arregloNotasActivas.forEach((element) => {
      if (parseInt(element.NotaId) !== parseInt(vvNotaId)) {
        numeroDeNotas++;
        vvNotaId = parseInt(element.NotaId);
        json = {
          NotaId: element.NotaId,
          ClienteId: element.ClienteId,
          Cliente: element.Cliente,
          Comentarios: element.Comentarios,
        };
        arregloNotasEncabezados.push(json);
      }
    });

    //##############################################

    await this.getClientes(); //Consulta Catálogo de Clientes

    this.setState({
      sucursales: arregloSucursales,
      SucursalId: arregloSucursales[0].SucursalId,
      detallesNotas: arregloNotasActivas,
      cantidadNotasAbiertas: numeroDeNotas,
      NotasEncabezados: arregloNotasEncabezados,
    });
    document.querySelector(".ventanaproductos").style.display = "none";
    document.querySelector(".CatalogoClientes").style.display = "none"
    this.CodigoBarrasInput.current.focus();
  }
  
  addRowHandlers = () => {
    const table = document.getElementById("table1");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {  //EL for es desde el rengón 1 porque el 0 son los encabezados de las columnas y marca error si se seleccionan.
      let currentRow = table.rows[i];
      let createClickHandler = (row) => {
        return () => {
          let cell = row.getElementsByTagName("td")[1];
          let vcodigobarras = cell.innerHTML;
          this.setState({
            CodigoBarras: vcodigobarras,
            VentanaDescripcion: "",
            VentanaDescripcionDetalles: [],
          });
          document.querySelector(".ventanaproductos").style.display = "none";
          document.querySelector("#btn-cancelarventa").style.display = "block";
          this.CodigoBarrasInput.current.focus();
        };
      };
        currentRow.onclick = createClickHandler(currentRow);
      }
  };

  async getSucursales() {
    const url = this.props.url + `/api/catalogos/10`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      const vSucursalAsignada = parseInt(sessionStorage.getItem("SucursalId"));
      if (vSucursalAsignada !== 100) {
        data = data.filter(
          (element) => element.SucursalId === vSucursalAsignada
        );
      }
      if (data.length === 0) {
        data = { error: "Error en Sucursales" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  getClientes = async () => {
    const url = this.props.url + `/api/catalogoclientes`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }
      this.setState({
        clientes: data,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  getNotas = async (SucursalId) => {
    const url = this.props.url + `/api/consultanotas/${SucursalId}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      return await response.json();

    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  getNotaPorFolio = async (NotaId) => {
    const SucursalId = this.state.SucursalId;
    const url =
      this.props.url + `/api/consultanotaporfolio/${SucursalId}/${NotaId}`;
    let data;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();

      let totalTicket = 0;
      let arregloDetalles = [];
      let json_elemento;
      let NotaId = 0;

      data.forEach((element) => {
        NotaId = element.NotaId;
        totalTicket +=
          parseFloat(element.PrecioVentaConImpuesto) *
          parseInt(element.Unidades);
        json_elemento = {
          CodigoId: element.CodigoId,
          CodigoBarras: element.CodigoBarras,
          Descripcion: element.Descripcion,
          PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
        };
        arregloDetalles.push(json_elemento);
      });

      this.setState({
        detalles: arregloDetalles,
        totalTicket: totalTicket,
        CodigoBarras: "",
        NotaId: NotaId,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  onGrabarVentas = async () => {
    if (this.state.detalles.length === 0) {
      alert("No hay productos");
      this.CodigoBarrasInput.current.focus();
      return;
    }

    const detalles = this.state.detalles;
    let vNotaRespalda = false;

    let arreglo = [];
    detalles.map((element, i) => {
      let jsonDetalles = {
        SerialId: i + 1,
        CodigoId: element.CodigoId,
        CodigoBarras: element.CodigoBarras,
        Descripcion: element.Descripcion,
        UnidadesVendidas: 1,
        PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
      };
      arreglo.push(jsonDetalles);
      return null;
    });

    //#################################################
    const NotaId = this.state.NotaId;
    const ClienteId = this.state.ClienteId;
    if (parseInt(NotaId) > 0) {
      let arregloNotasParaValidar = [];
      let json2;
      this.state.detallesNotaSeleccionada.forEach((element) => {
        json2 = {
          CodigoId: element.CodigoId,
          CodigoBarras: element.CodigoBarras,
          Descripcion: element.Descripcion,
          PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
        };
        arregloNotasParaValidar.push(json2);
      });
      if (this.state.NotaModificada) {
        alert("SI SE MODIFICO LA NOTA!!! HAY QUE ACTUALIZARLA");
        vNotaRespalda = true;
      }
    }
    //#################################################

    const json = {
      SucursalId: this.state.SucursalId,
      CajeroId: sessionStorage.getItem("ColaboradorId"),
      VendedorId: sessionStorage.getItem("ColaboradorId"),
      Usuario: sessionStorage.getItem("user"),
      detalles: arreglo,
      NotaId: this.state.NotaId,
      NotaRespalda: vNotaRespalda,
      ClienteId: ClienteId,
    };

    try {
      //if (window.config('Desea Cerrar la Venta')){
      const url = this.props.url + `/api/grabaventas`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          Authorization: `Bear ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }
      this.setState({
        CodigoBarras: "",
        detalles: [],
        totalTicket: 0.0,
        NotaId: 0,
      });
      alert("FOLIO VENTA: " + data.Success);
      this.CodigoBarrasInput.current.focus();
      //}
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  onhandleRespaldaBorraModificaNota = async (NotaId, ClienteId) => {
    const SucursalId = this.state.SucursalId;
    const Usuario = sessionStorage.getItem("user");
    const ColaboradorId = sessionStorage.getItem("ColaboradorId");
    const arregloNota = this.state.detalles;
    const url = this.props.url + `/api/respaldaborramodificanota`;
    const json = {
      SucursalId: SucursalId,
      NotaId: NotaId,
      Usuario: Usuario,
      ColaboradorId: ColaboradorId,
      ClienteId: ClienteId,
      arregloNota: arregloNota,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  onGrabarNotas = async () => {
    /*
    CREATE TABLE clientes
        ("ClienteId" INT,
        "Nombre" VARCHAR(150) NOT NULL,
        "ApellidoPaterno" VARCHAR(50),
        "ApellidoMaterno" VARCHAR(50),
        "Status" CHAR(1) NOT NULL DEFAULT 'A',
        "Telefono" CHAR(10),
        "RFC" CHAR(14),
        "RazonSocial" VARCHAR(200),
        "DomicilioFiscal" VARCHAR(200),
        "Email" VARCHAR(60),
        "campo1" VARCHAR(10),
        "campo2" VARCHAR(10),
        "campo3" VARCHAR(10),
        "campo4" VARCHAR(10),
        "campo5" VARCHAR(10),
        "SucursalIdAlta" SMALLINT NOT NULL,
        "FechaHora" TIMESTAMPTZ NOT NULL,
        "Usuario" VARCHAR(30) NOT NULL
        );
        ALTER TABLE clientes ADD PRIMARY KEY("ClienteId");

        INSERT INTO clientes("ClienteId","Nombre","SucursalIdAlta","FechaHora","Usuario") VALUES(0,'PUBLICO EN GENERAL',1,CLOCK_TIMESTAMP(),'eugalde');

    CREATE TABLE notas      
        ("SucursalId" SMALLINT,
        "NotaId" INTEGER,
        "SerialId" INTEGER,
        "ClienteId" INTEGER,
        "Status" CHAR(1) NOT NULL,
        "Fecha" DATE NOT NULL,
        "CodigoId" INTEGER NOT NULL,
        "CodigoBarras" CHAR(13) NOT NULL,
        "Unidades" SMALLINT NOT NULL,
        "PrecioVentaConImpuesto" DEC(12,2) NOT NULL,
        "Campo1" VARCHAR(10),
        "Campo2" VARCHAR(10),
        "Campo3" VARCHAR(10),
        "Campo4" VARCHAR(10),
        "Campo5" VARCHAR(10),
        "Campo6" VARCHAR(10),
        "Campo7" VARCHAR(10),
        "Campo8" VARCHAR(10),
        "Campo9" VARCHAR(10),
        "Campo10" VARCHAR(10),
        "Comentarios" VARCHAR(200),
        "ColaboradorId" SMALLINT NOT NULL,
        "FechaHora" TIMESTAMPTZ NOT NULL,
        "Usuario" VARCHAR(30)
        );
        ALTER TABLE notas ADD PRIMARY KEY("SucursalId","NotaId","SerialId");
        ALTER TABLE notas ADD CONSTRAINT sucursalId_fk FOREIGN KEY("SucursalId") REFERENCES sucursales("SucursalId");
        ALTER TABLE notas ADD CONSTRAINT clienteId_fk FOREIGN KEY("ClienteId") REFERENCES clientes("ClienteId");
        ALTER TABLE notas ADD CONSTRAINT fecha_fk FOREIGN KEY("Fecha") REFERENCES dim_catalogo_tiempo("Fecha");
        ALTER TABLE notas ADD CONSTRAINT codigoId_fk FOREIGN KEY("CodigoId") REFERENCES productos("CodigoId");
        ALTER TABLE notas ADD CONSTRAINT colaboradorId_fk FOREIGN KEY("ColaboradorId") REFERENCES colaboradores("ColaboradorId");
        


        CREATE TABLE notas_historia      
        ("FolioIdRespaldo" SERIAL,
         "FechaHoraRespaldo" TIMESTAMPTZ NOT NULL,
         "UsuarioRespaldo" VARCHAR(30),
        "SucursalId" SMALLINT,
        "NotaId" INTEGER,
        "SerialId" INTEGER,
        "ClienteId" INTEGER,
        "Status" CHAR(1) NOT NULL,
        "Fecha" DATE NOT NULL,
        "CodigoId" INTEGER NOT NULL,
        "CodigoBarras" CHAR(13) NOT NULL,
        "Unidades" SMALLINT NOT NULL,
        "PrecioVentaConImpuesto" DEC(12,2) NOT NULL,
        "Campo1" VARCHAR(10),
        "Campo2" VARCHAR(10),
        "Campo3" VARCHAR(10),
        "Campo4" VARCHAR(10),
        "Campo5" VARCHAR(10),
        "Campo6" VARCHAR(10),
        "Campo7" VARCHAR(10),
        "Campo8" VARCHAR(10),
        "Campo9" VARCHAR(10),
        "Campo10" VARCHAR(10),
        "Comentarios" VARCHAR(200),
        "ColaboradorId" SMALLINT NOT NULL,
        "FechaHora" TIMESTAMPTZ NOT NULL,
        "Usuario" VARCHAR(30)
        );
        ALTER TABLE notas ADD PRIMARY KEY("FolioId"");





        ALTER TABLE ventas ADD COLUMN "ClienteId" TYPE INT;
        UPDATE ventas SET "ClienteId" = 0;
        ALTER TABLE ventas ALTER COLUMN "ClienteId" SET NOT NULL;
        ALTER TABLE ventas ALTER COLUMN "ClienteId" SET DEFAULT 0;




        ALTER TABLE ventas ADD COLUMN "FolioIdInventario" TYPE INT;
        UPDATE ventas SET "FolioIdInventario" = "FolioId";
        ALTER TABLE ventas ALTER COLUMN "FolioIdInventario" SET NOT NULL;
        ALTER TABLE ventas ALTER COLUMN "FolioIdInventario" SET DEFAULT 0;

        ALTER TABLE ventas ADD COLUMN "UnidadesRegistradas" TYPE SMALLINT;
        UPDATE ventas SET "UnidadesRegistradas" = "UnidadesVendidas";
        ALTER TABLE ventas ALTER COLUMN "UnidadesRegistradas" SET NOT NULL;
        ALTER TABLE ventas ALTER COLUMN "UnidadesRegistradas" SET DEFAULT 0;

        CREATE VIEW vw_clientes AS
        SELECT *,
        "Nombre" ||' '|| CASE WHEN "ApellidoPaterno" IS NULL THEN '' ELSE "ApellidoPaterno" END||' '||
        CASE WHEN "ApellidoMaterno" IS NULL THEN '' ELSE "ApellidoMaterno" END AS "Cliente"
        FROM clientes;

        UPDATE ventas SET "Status" = 'V';
    */
    const SucursalId = this.state.SucursalId;
    const NotaId = this.state.NotaId;
    const ClienteId = this.state.ClienteId;
    let json={}
    let vNotaId=0

    if (parseInt(NotaId) === 0) { //Si NotaId es CERO es que no hay abierta ninguna nota
      
      if (this.state.detalles.length === 0) {
        alert("No hay productos");
        this.CodigoBarrasInput.current.focus();
        return;
      }

      alert("Falta Comentarios");
      json = {
        detalles: this.state.detalles,
        totalTicket: this.state.totalTicket,
        ColaboradorId: sessionStorage.getItem("ColaboradorId"),
        Comentarios: "",
        Usuario: sessionStorage.getItem("user"),
      };

      try {
        const url = this.props.url + `/api/grabanotas`;
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          return;
        }

        //##############################################
        const arregloNotasActivas = await this.getNotas(SucursalId); //Consulta todas las notas

        json = {};
        let arregloNotasEncabezados = [];
        let vNotaId = 0;
        let numeroDeNotas = 0;
        arregloNotasActivas.forEach((element) => {
          if (parseInt(element.NotaId) !== parseInt(vNotaId)) {
            numeroDeNotas++;
            vNotaId = parseInt(element.NotaId);
            json = {
              NotaId: element.NotaId,
              ClienteId: element.ClienteId,
              Cliente: element.Cliente,
              Comentarios: element.Comentarios,
            };
            arregloNotasEncabezados.push(json);
          }
        });
        //##############################################

        this.setState({
          CodigoBarras: "",
          detalles: [],
          totalTicket: 0.0,
          detallesNotas: arregloNotasActivas,
          cantidadNotasAbiertas: numeroDeNotas,
          NotasEncabezados: arregloNotasEncabezados,
          NotaModificada: false,
        });
        alert("FOLIO NOTA: " + data.message);
        this.CodigoBarrasInput.current.focus();
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        return;
      }
    } else { //Si NotaId es DIFERENTE de CERO hay una Nota ABIERTA
      if (this.state.NotaModificada) { //SI ES TRUE LA NOTA ABIERTA CAMBIÓ
        
        this.onhandleRespaldaBorraModificaNota(NotaId, ClienteId);

        //##############################################
        const arregloNotasActivas = await this.getNotas(SucursalId); //Consulta todas las notas

        json = {};
        let arregloNotasEncabezados = [];
        vNotaId = 0;
        let numeroDeNotas = 0;
        arregloNotasActivas.forEach((element) => {
          if (parseInt(element.NotaId) !== parseInt(vNotaId)) {
            numeroDeNotas++;
            vNotaId = parseInt(element.NotaId);
            json = {
              NotaId: element.NotaId,
              ClienteId: element.ClienteId,
              Cliente: element.Cliente,
              Comentarios: element.Comentarios,
            };
            arregloNotasEncabezados.push(json);
          }
        });

        //##############################################

        this.setState({
          CodigoBarras: "",
          detalles: [],
          totalTicket: 0.0,
          NotaId: 0,
          detallesNotas: arregloNotasActivas,
          cantidadNotasAbiertas: numeroDeNotas,
          NotasEncabezados: arregloNotasEncabezados,
          NotaModificada: false,
        });
        this.CodigoBarrasInput.current.focus();
        //##################################
      } else { //AQUI LA NOTA NO CAMBIO PERO SE VUELVE A GUARDAR COMO NOTA.
        
        let arregloNotas = this.state.detallesNotas;

        this.state.detallesNotaSeleccionada.forEach((element) => {
          arregloNotas.push(element);
        });

        const arregloNotasOrdenadas = arregloNotas.sort(
          (a, b) => parseInt(a.NotaId) - parseInt(b.NotaId)
        );

        json = {};
        let arregloNotasEncabezados = [];
        let NotaId_temp = 0;
        let numeroDeNotas = 0;
        arregloNotasOrdenadas.forEach((element) => {
          if (parseInt(element.NotaId) !== parseInt(NotaId_temp)) {
            numeroDeNotas++;
            NotaId_temp = parseInt(element.NotaId);
            json = {
              NotaId: element.NotaId,
              Cliente: element.Cliente,
              Comentarios: element.Comentarios,
            };
            arregloNotasEncabezados.push(json);
          }
        });

        this.setState({
          detallesNotas: arregloNotasOrdenadas,
          totalTicket: 0.0,
          detalles: [],
          NotaId: 0,
          NotasEncabezados: arregloNotasEncabezados,
          cantidadNotasAbiertas: numeroDeNotas,
          NotaModificada: false,
        });
      }
    }
  };

  handleSucursales = (e) => {
    const SucursalId = e.target.value;
    this.setState({
      SucursalId: SucursalId,
    });
    this.CodigoBarrasInput.current.focus();
  };

  handleClientes = (e) => {
    const ClienteId = e.target.value;
    const arregloClientes = this.state.clientes
    const arreglo2Clientes = arregloClientes.filter((element) => parseInt(element.ClienteId) === parseInt(ClienteId))  
    // alert(JSON.stringify(arreglo2Clientes))
    alert(JSON.stringify(ClienteId))
    if(parseInt(ClienteId) === 2){
      document.querySelector(".CatalogoClientes").style.display = 'block'
    }
    this.setState({
      ClienteId: ClienteId,
    });
    this.CodigoBarrasInput.current.focus();
  };

  handleCodigoBarras = (e) => {
    const CodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: CodigoBarras,
    });
  };

  async getProducto(id) {
    const SucursalId = this.state.SucursalId;
    const url = this.props.url + `/api/productosdatosventa/${SucursalId}/${id}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    });
    let data = await response.json();
    if (data.length === 0) {
      data = { error: "Producto No Existe" };
    }
    return data;
  }

  async getProductosDescripcion(desc) {
    const url = this.props.url + `/api/productosdescripcion/${desc}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    });
    let data = await response.json();
    return data;
  }

  handleBuscar = async (e) => {
    e.preventDefault();
    const SucursalId = this.state.SucursalId;
    const ClienteId = this.state.ClienteId;
    const NotaId = this.state.NotaId;

    let Unidades = 1;

    const CodigoBarras = this.state.CodigoBarras;
    let arreglo = [];
    if (CodigoBarras !== "") {
      arreglo = await this.getProducto(CodigoBarras);

      if (arreglo.error) {
        alert(arreglo.error);
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }

      if (arreglo[0].PrecioVentaConImpuesto <= 0) {
        alert("Este producto No tiene Precio de Venta");
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }

      if (arreglo[0].CostoPromedio <= 0) {
        alert("Este producto No tiene Costo o no se ha Recibido");
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }
    } else {
      if (
        document.querySelector(".ventanaproductos").style.display === "none"
      ) {
        document.querySelector(".ventanaproductos").style.display = "block";
        document.querySelector("#btn-cancelarventa").style.display = "none";
        this.ventanadescripcionInput.current.focus();
      } else {
        this.setState({
          VentanaDescripcion: "",
          VentanaDescripcionDetalles: [],
        });
        document.querySelector(".ventanaproductos").style.display = "none";
        document.querySelector("#btn-cancelarventa").style.display = "block";
        this.CodigoBarrasInput.current.focus();
      }
      return;
    }
    let totalTicket =
      parseFloat(this.state.totalTicket) +
      parseFloat(arreglo[0].PrecioVentaConImpuesto) * Unidades;

    let arregloDetalles = this.state.detalles;
    let json = {
      SucursalId: SucursalId,
      ClienteId: ClienteId,
      NotaId: NotaId,
      CodigoId: arreglo[0].CodigoId,
      CodigoBarras: this.state.CodigoBarras,
      Descripcion: arreglo[0].Descripcion,
      Unidades: Unidades,
      PrecioVentaConImpuesto: arreglo[0].PrecioVentaConImpuesto,
    };
    arregloDetalles.push(json);

    let NotaModificada = false;
    if (parseInt(NotaId) > 0) {
      NotaModificada = true;
    }

    this.setState({
      detalles: arregloDetalles,
      totalTicket: totalTicket,
      CodigoBarras: "",
      NotaModificada: NotaModificada,
    });
    this.CodigoBarrasInput.current.focus();
  };


  handleBuscarEnter = (e) => {
    if (e.key === "Enter") {
      this.handleBuscar(e);
    }
  };

  handleCancelar = async (e) => {
    e.preventDefault();

    const NotaId = this.state.NotaId;

    if (parseInt(NotaId) > 0) {
      let NotaModifica = this.state.NotaModifica;
      let NotaRespalda = false;
      let detalles = [];
      if (NotaModifica) {
        NotaRespalda = true;
        detalles = this.state.detalles;
      }

      //Cancela Nota Abierta
      const url = this.props.url + `/api/cancelanota`;

      const json = {
        SucursalId: this.state.SucursalId,
        NotaId: NotaId,
        ColaboradorId: sessionStorage.getItem("ColaboradorId"),
        Usuario: sessionStorage.getItem("user"),
        NotaRespalda: NotaRespalda,
        detalles: detalles,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
          return;
        }
        // this.setState({
        //   NotaId: 0,
        // });
        alert(data.message);
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    }

    this.setState({
      CodigoBarras: "",
      totalTicket: 0.0,
      detalles: [],
      NotaId: 0,
      NotaModificada: false,
    });

    this.CodigoBarrasInput.current.focus();
  };

  handleVentanaDescripcion = async (e) => {
    const VentanaDescripcion = e.target.value.toUpperCase();
    this.setState({
      VentanaDescripcion: VentanaDescripcion,
    });
    let arreglo = [];
    if (VentanaDescripcion.length >= 3) {
      arreglo = await this.getProductosDescripcion(VentanaDescripcion);
    }
    if (arreglo.error) {
      alert(arreglo.error);
      return;
    }
    this.setState({
      VentanaDescripcionDetalles: arreglo,
    });
    this.addRowHandlers();
  };

  handleEliminar = (e) => {
    e.preventDefault();
    let id = e.target.id;
    let arregloDetalles = this.state.detalles;

    const NotaId = this.state.NotaId;
    let NotaModificada;
    if (parseInt(NotaId) > 0) {
      NotaModificada = true;
    }

    arregloDetalles = arregloDetalles.filter(
      (element, i) => i !== parseInt(id)
    );

    let vtotalTicket = 0;
    for (let i = 0; i < arregloDetalles.length; i++) {
      vtotalTicket += parseFloat(arregloDetalles[i].PrecioVentaConImpuesto);
    }
    if (arregloDetalles.length === 0) {
      //Cancelar Ticket
      this.setState({
        CodigoBarras: "",
        totalTicket: 0.0,
        detalles: [],
        NotaModificada: NotaModificada,
      });
    } else {
      this.setState({
        detalles: arregloDetalles,
        totalTicket: vtotalTicket,
        NotaModificada: true,
      });
    }
  };

  ventasPendientesRecupera = (NotaId) => {
    if (this.state.detalles.length === 0) {
      this.getNotaPorFolio(NotaId);

      const detallesNotaSeleccionada = this.state.detallesNotas.filter(
        (element) => parseInt(element.NotaId) === parseInt(NotaId)
      );
      const detalleNotasArreglo = this.state.detallesNotas.filter(
        (element) => parseInt(element.NotaId) !== parseInt(NotaId)
      );

      let json = {};
      let arregloNotasEncabezados = [];
      let NotaId_temp = 0;
      let numeroDeNotas = 0;
      detalleNotasArreglo.forEach((element) => {
        if (parseInt(element.NotaId) !== parseInt(NotaId_temp)) {
          numeroDeNotas++;
          NotaId_temp = parseInt(element.NotaId);
          json = {
            NotaId: element.NotaId,
            Cliente: element.Cliente,
            Comentarios: element.Comentarios,
          };
          arregloNotasEncabezados.push(json);
        }
      });

      this.setState({
        detallesNotas: detalleNotasArreglo,
        detallesNotaSeleccionada: detallesNotaSeleccionada,
        cantidadNotasAbiertas: numeroDeNotas,
        NotasEncabezados: arregloNotasEncabezados,
      });

      this.CodigoBarrasInput.current.focus();
    }
  };

  handleRender = () => {
    return (
      <React.Fragment>
        {/* Catálogo de Clientes */}
        <div className="CatalogoClientes">

        </div>
        <div className="col-md-5 header">
          <select
            onChange={this.handleSucursales}
            id="sucursales"
            name="sucursales"
            value={this.state.SucursalId}
          >
            {this.state.sucursales.map((element, i) => (
              <option key={i} value={element.SucursalId}>
                {element.Sucursal}
              </option>
            ))}
          </select>
          <select
            onChange={this.handleClientes}
            className="ml-2"
            id="clientes"
            name="clientes"
            value={this.state.ClienteId}
          >
            {this.state.clientes.map((element, i) => (
              <option key={i} value={element.ClienteId}>
                {element.Cliente}
              </option>
            ))}
          </select>
          <br />
          <label
            htmlFor="codigobarras"
            style={{ fontSize: ".8em", width: "3em" }}
          >
            Código Barras
          </label>
          <input
            onChange={this.handleCodigoBarras}
            onKeyPress={this.handleBuscarEnter}
            id="codigobarras"
            name="codigobarras"
            size="15"
            maxLength="13"
            value={this.state.CodigoBarras}
            ref={this.CodigoBarrasInput}
            autoComplete="off"
          />
          <button
            onClick={this.handleBuscar}
            className="btn btn-primary btn-sm ml-2"
          >
            Buscar
          </button>
          <br />

          <div className="ventanaproductos">
            <label htmlFor="ventanadescripcion" style={{ width: "5rem" }}>
              Descripcion
            </label>
            <input
              onChange={this.handleVentanaDescripcion}
              id="ventanadescripcion"
              name="ventanadescripcion"
              value={this.state.VentanaDescripcion}
              ref={this.ventanadescripcionInput}
              autoComplete="off"
            />
            <table id="table1" onClick={this.handlerRowClicked}>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Codigo Barras</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                {this.state.VentanaDescripcionDetalles.map((element, i) => (
                  <tr key={i}>
                    <td>{element.CodigoId}</td>
                    <td>{element.CodigoBarras}</td>
                    <td>{element.Descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label style={{ fontSize: ".8em", width: "4em" }}>
            Total Unidades
          </label>
          <input
            id="totalUnidades"
            name="totalUnidades"
            size="3"
            maxLength="3"
            type="text"
            value={this.state.detalles.length}
            style={{ textAlign: "right" }}
            readOnly
          />
          <button
            onClick={this.handleCancelar}
            className="btn btn-danger btn-sm ml-5"
            id="btn-cancelarventa"
          >
            <small>CANCELAR TICKET</small>
          </button>
          <br />
        </div>
        <div className="col-md-5">
          <div className="content">
            <ul>
              {this.state.detalles.map((element, i) => (
                <li key={i}>
                  <small>{element.Descripcion}</small> {element.CodigoBarras}{" "}
                  <br /> <strong>$ {element.PrecioVentaConImpuesto}</strong>
                  <button
                    onClick={(e) => {
                      if (
                        window.confirm(
                          "Are you sure you wish to delete this item?"
                        )
                      )
                        this.handleEliminar(e);
                    }}
                    id={i}
                    className="btn btn-danger btn-sm ml-2"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/*DESPLIEGA NOTAS PENDIENTES */}
          <div id="notaspendientes">
            <div>
              <span style={{ fontSize: "0.7rem" }}>
                <strong>Notas en Proceso</strong>{" "}
                {this.state.cantidadNotasAbiertas}
              </span>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem" }}>
                <strong>Nota :</strong>
              </span>
              <span className="badge badge-success">{this.state.NotaId}</span>
              <br />
            </div>
          </div>
          <div className="notas">
            {/* La siguiente instrucción hace un DISTINCT de los NotaId 
                         {[...new Set(this.state.detallesNotas.map(x => x.NotaId))].map((element,i) => */}
            {/* ( */}
            {/* <button onClick={()=>{this.ventasPendientesRecupera(element)}} key={i}>{element}</button> */}
            {/* ) } */}

            {this.state.NotasEncabezados.map((element, i) => (
              <div key={i}>
                <button
                  onClick={() => {
                    this.ventasPendientesRecupera(element.NotaId);
                  }}
                >
                  {element.NotaId}
                </button>
                <span>{element.Cliente}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-5 footer">
          <label style={{ width: "2em" }}>
            <small>
              <strong>Total Ticket</strong>
            </small>
          </label>
          <input
            id="totalTicket"
            name="totalTicket"
            size="8"
            maxLength="8"
            type="text"
            value={"$ " + this.state.totalTicket}
            style={{ textAlign: "right" }}
            readOnly
          />

          <button
            onClick={this.onGrabarVentas}
            className="btn btn-success btn-sm mt-2"
            id="btn-registrarventa"
          >
            REGISTRAR VENTA
          </button>
          <button
            onClick={this.onGrabarNotas}
            className="btn btn-warning btn-sm mt-3"
            style={{ fontSize: "0.77rem" }}
            id="btn-nota"
          >
            REGISTRAR NOTA
          </button>
        </div>
 
      </React.Fragment>
    );
  };
  render() {
    return this.state.sucursales.length ? (
      <this.handleRender />
    ) : (
      <h3>Loading...</h3>
    );
  }
}

export default PuntoDeVenta;
