# Stock Data Processing Application

## Overview
This project provides 2 parts, back-end and front-end. Backend provides an API to receive the csv file and return the result.

On the front-end, user can upload the file and get the result.

## Back-end:
Developed on nodejs (express). The api which accepts file input and return the result: `api/process-stock-data`.

Sample curl command: 

`curl --location 'http://0.0.0.0:3001/api/process-stock-data' \
--form 'file=@"file_name.csv"'`

Sample successful response:

```
{
    "code": 200,
    "message": "Service returned result successfully",
    "data": {
        "company": "OQB",
        "incremental-value": "850.00"
    }
}
```
### Configure and start the back-end

1. `cd backend`
2. `npm install`
3. `node index.js` or `npm start`
   
## Front-end 
Front-end used React (create-react-app), which user can upload file and get result from backend. 

### Configuration and start the app

1. `cd frontend`
2. `npm install`
3. `npm start`

### Sample Results (`/test-data-file/values.csv` and `/test-data-file/values_2.csv`)


1. `/test-data-file/values.csv` Result screenshot:
   
![`/test-data-file/values.csv` Result screenshot](/test-data-file/res_1.png)

1. `/test-data-file/values_2.csv` Result screenshot:
   
![`/test-data-file/values_2.csv` Result screenshot](/test-data-file/res_2.png)