import {Response} from 'express';
const BasicResponse ={
    "success" : false,
    "message" : "",
    "data" : {}
};

const responseWithSuccess = (res:Response,data:any,message:string="") => {
    let response = Object.assign({}, BasicResponse);
    response.success = true;
    response.data = data;
    response.message = message;
    res.status(200).json(response);
}

const responseWithError = (error:any) => {

}

export const ResponseManager = { responseWithSuccess,responseWithError}