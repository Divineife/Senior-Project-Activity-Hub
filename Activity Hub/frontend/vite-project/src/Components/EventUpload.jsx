// import { useState } from "react"
// import axios from 'axios'

function EventUpload(){
    // const [file, setFile] = useState();

    const handleFileChange = (e) => {
        // setFile(e.target.files[0]);
        console.log(e)
      };
    
    const upload = () => {
        // if (file){
        //     const formData = new FormData()
        //     FormData.append('file', file)
        //     axios.post('http://localhost:3000/upload')
        //     .then(res => {})
        //     .catch(e => {console.log(e)})
        // }else{
        //     console.log("No file Selected")
        // }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} name="" id="" />
            <button type = "button" onClick={upload}> Submit </button>
        </div>
    )
}
export default EventUpload;