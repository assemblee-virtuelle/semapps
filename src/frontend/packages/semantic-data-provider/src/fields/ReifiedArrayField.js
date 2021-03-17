import React, {useState, useEffect} from 'react';
import { ArrayField,useDataProvider } from 'react-admin';
import {default as FilteredArrayField} from './FilteredArrayField'


const ReifiedArrayField  = ({children, groupReference, groupContainer, groupLabel, filterProperty, ...otherProps}) =>{
  const dataProvider = useDataProvider();
  const [groupes,setGroups] = useState();

  useEffect(() => {
    if(!groupes){
      dataProvider.getList(groupReference,{'@id':process.env.REACT_APP_MIDDLEWARE_URL + groupContainer}).then(groupes=>{
          setGroups(groupes.data);
      }).catch(e=>{
          setGroups([]);
      })
    }
  },[groupes]);



  return (
    <>
    {
      groupes?.map((group, index) =>{
        let filter={};
        filter[filterProperty]=group.id;
        return  <div key={index}>
                  <h2>{group[groupLabel]}</h2>
                  <FilteredArrayField {...otherProps} filter={filter}>
                      {React.Children.only(children, (child, i) => {
                        return React.cloneElement(child, {});
                      })}
                  </FilteredArrayField>
                </div>
          }
      )
    }
    </>
  );
}

export default ReifiedArrayField;
