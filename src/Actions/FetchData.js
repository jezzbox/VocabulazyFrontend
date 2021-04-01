const fetchData = async (url,method='GET',bodyData=[]) => {
    try {
        const baseUrl = `https://www.api.vocabulazy.co.uk/api/`

        if(method==='GET') {
        const res = await fetch(baseUrl + url)
        const dataFromServer = await res.json()
        return { dataFromServer, error:null }
        }

        else if(method==='DELETE') {
            await fetch(baseUrl + url, {
                method: 'DELETE',
            })
            return { dataFromServer:[], error:null }
            
        }

        else {
            const res = await fetch(baseUrl + url,{
                        method: method,
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(bodyData)
                    })
            const dataFromServer = await res.json()
            return { dataFromServer, error:null }

        }
        
    } catch (error) {
        return { dataFromServer:[], error }
    }
    
    //     return dataFromServer;

    // const getData = async () => {
    //     const res = await fetch(baseUrl+ url)
    //     const dataFromServer = await res.json()
    //     return dataFromServer;
    // }

    // const changeData = async(method=method) => {
    //     const res = await fetch(baseUrl+ url, {
    //         method: method,
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify(body)
    //     })
    //     const dataFromServer = await res.json()
    //     return dataFromServer;

    // }

    // const fetchData = async () => {
    //     if(url === null) {
    //         console.log("loading ...")
    //         setIsPending(false)
    //         return
    //     }
    //     else if (method === 'GET') {
    //         const dataFromServer = await getData()

    //         if(postOn404 && dataFromServer.status === 404) {
    //             const dataFromServer = await changeData('POST')
    //             setData(dataFromServer)
    //             setIsPending(false)
    //         }
    //         else {
    //             setData(dataFromServer)
    //             console.log(data)
    //             console.log(dataFromServer)
    //             setIsPending(false)
    //         }

    //     }

    //     else if (method === 'DELETE') {
    //         await fetch(baseUrl+ url, {
    //             method: 'DELETE',
    //         })
    //         setIsPending(false)
    //     }

    //     else {
    //         const dataFromServer = await changeData()
    //         setData(dataFromServer)
    //         setIsPending(false)
    //     }
}

export default fetchData;