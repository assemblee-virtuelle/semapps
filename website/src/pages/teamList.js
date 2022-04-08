import React, { useEffect, useState } from 'react';

export default function TeamList(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect( () => {
      (async function () {
        const method = {
          method: 'GET',
          headers: {
            'accept': 'application/ld+json',
          }
        }
        const response = await fetch('https://data.virtual-assembly.org/users', method)
        const responseData = await response.json()
        if (response.ok){
          const responseLdp = responseData["ldp:contains"];

          const onlyPerson = (user) => {
            const type = user.type
            let isperson = false
            if (Array.isArray(type))
            {
              type.forEach((item, i) => {
                if ( item.includes("Person") ){
                  isperson = true
                  return isperson
                }
              });
            }
            else // string
            {
              isperson = type.includes("Person")
            }
            return isperson
          }
          setUsers(responseLdp.filter(onlyPerson));
        }
        else {
          console.log(JSON.Stringify(response))
        }
        setLoading(false)
     })()
    }, []);
    if (loading)
      return "chargement..."
    return <ul>
    {users.map(t => <li>{t["pair:label"]}</li>)}
    </ul>
  }
