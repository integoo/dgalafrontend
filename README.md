# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


1. npx create-react-app dgalafrontend
2. Simple React Snippets (Burke Holland) (imrc, cc)
3. Prittier - Code formatter (Esben Petersen) Enable formatting on save. Preference, Settings, agregar: "editor.formatOnSave": true,
4. npm install bootstrap (index.js import 'bootstrap/dist/css/bootstrap.css') (import 'bootstrap/dist/css/bootstrap.min.css';)
5.  npm install jquery popper.js (Next, go to the src/index.js file and add the following imports:)
    import $ from 'jquery';
    import Popper from 'popper.js';
    import 'bootstrap/dist/js/bootstrap.bundle.min';
6. Usé npm install react-number-format --save para poder dar formato a números y tener el teclado numérico en mobile.
7. https://github.com/reactchartjs/react-chartjs-2
    npm install --save react-chartjs-2 chart.js
8.https://react-icons.github.io/react-icons
    npm install react-icons
    En la página tiene las opciones de todos los grupos de icons y su sintaxis.
    Ant Design Icons: 
    import { IconName } from "react-icons/ai";
    	<IconName />
    Bootstrap Icons:
    import { IconName } from "react-icons/bs"
    	< IconName />


################ IMPORTANTE EN CASO DE REHACER LA VERSION O PARA QUITAR ALGUN PAQUETE ####################
0. Sacar una copia de GitHub : git clone <direccion de github>
1. Editar y borrar los paquetes de package.json
2. Se puede o se debe borrar el archivo package-lock.json y el directorio node_modules
3. npm install
4. Si hubo cambios y no se postearon, hay que copiar el directorio "components"

##########################################################################################################
React Spinners

En Chrome:
https://www.npmjs.com/package/react-spinners
https://www.davidhu.io/react-spinners/

npm i react-spinners

import HashLoader from "react-spinners/HashLoader";

handleFetch =async()=>{
        this.setState({
            loading: true,
            arreglo:[],
        })
            // const response = await fetch("https://jsonplaceholder.typicode.com/users")
            const response = await fetch("https://www.vizgr.org/historical-events/search.php?format=json&begin_date=-3000000&end_date=20151231&lang=es")
            const data = await response.json()
            this.setState({
                arreglo: data,
                loading: false,
            })


    }
render(){

        const loading = this.state.loading
        // const override: CSSProperties = {
  const override ={
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

        return(
            <React.Fragment>
                <h1>Hello World!!!!</h1>
                <button onClick={this.handleFetch}>Procesar</button>
                {/* <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.arreglo.map((element,i)=>(
                        <tr key={i}>
                            <td>{element.name}</td>
                        </tr>

                        ))}
                    </tbody>
                </table> */}

                <HashLoader color="#36d7b7" loading={loading} cssOverride={override} size={150} />
            </React.Fragment>
        )
    }
#######################################################################
Para no evitar darle click a botón antes de que termine un proceso Async
https://stackoverflow.com/questions/58368074/how-to-disable-react-button-until-meteor-method-finishes
import React, {useState} from "react"

const SampleAsync = () => {

  let [isWaiting, setWaiting ] = useState(false)

  let meteorMethod = () => {
      setWaiting(true)
      Meteor.call('insertSometing', data,(result,error) => {
        if(error) 
        console.log('erro')
        else
        setWaiting(false)
      })
  }


  // If isWaiting is true the button disable and if false unable
  // you can also do this: <button disable={isWaiting} onClick={meteorMethod}>Submit</button>
  return (
    <div>
      // you can add inline if
      <button disable={isWaiting == true ? true : false  } onClick={meteorMethod}>Submit</button>
    </div>
  )
}

export default SampleAsync;
###################################################################################################
