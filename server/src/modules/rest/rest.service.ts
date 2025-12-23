import axios from "axios";


interface RestExecuteInput{

    method : string;
    url : string;
    headers ? : Record<string,string>
    body? : any

}


export async function executeRestService(input : RestExecuteInput){

    const {method, url , headers, body} = input;

    const response = await axios({
        method,
        url,
        headers,
        data : body,
        validateStatus :()=>true
    })
    return {
        status : response.status,
        data : response.data,
        headers : response.headers
    }
}