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
              type.forEach(item => {
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

          const onlySemapps = (user) => {
            const cercle = user["pair:involvedIn"]
            let isSemapps = false
            if (typeof cercle != "undefined")
            {
//              console.log(user)
              if (Array.isArray(cercle))
              {
                cercle.forEach(item => {
                  if ( item.includes("/semapps") ){
                    isSemapps = true
                    return isSemapps
                  }
                });
              }
              else // string
              {
                isSemapps = cercle.includes("/semapps")
              }
            }
            return isSemapps
          }

          setUsers(() => {
            const filterList = responseLdp.filter(onlyPerson).filter(onlySemapps)
            console.log(filterList);
            return filterList
          });
        }
        else {
          console.log(JSON.Stringify(responseLdp))
        }
        setLoading(false)
     })()
    }, []);
    if (loading)
      return "chargement..."
    return <ul>
    {
      users.map(user => {
        //Get list of Skills for each users
        const skills = user["pair:offers"]
        let skillList = "";
        if (typeof skills != "undefined")
        {
          if (Array.isArray(skills))
          {
            let cpt = 1;
            for (let skill of skills){
              skillList += skill.split("/").pop();
              if (cpt < skills.length)
                skillList += ", "
              cpt ++
            }
          }
          else {
            skillList = skills.split("/").pop();
          }
        }
        else{
          skillList = "No skill"
        }

        //Get list of roles for each users
        const roles = user["og:leads"]
        let roleList = "";
        if (typeof roles != "undefined")
        {
          if (Array.isArray(roles))
          {
            let cpt = 1;
            for (let role of roles){
              roleList += role.split("/").pop();
              if (cpt < roles.length)
                roleList += ", "
              cpt ++
            }
          }
          else {
            roleList = roles.split("/").pop();
          }
        }
        else{
          skillList = "No skill"
        }

        const li =
        <li key={user.id}>{user["pair:label"]}
          <ul><li><b>Skills</b> : {skillList}</li></ul>
          <ul><li><b>Roles</b> : {roleList}</li></ul>
        </li>
        return li
      })
    }
    </ul>
  }
